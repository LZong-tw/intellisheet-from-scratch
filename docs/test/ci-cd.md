# CI/CD 測試整合指南

本指南說明如何將測試整合到持續整合/持續部署（CI/CD）流程中。

## GitHub Actions 設置

### 基本測試工作流程

建立 `.github/workflows/test.yml`：

```yaml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella
          fail_ci_if_error: true

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  build:
    name: Build
    needs: [unit-tests, e2e-tests]
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/
```

### 進階配置

#### 1. 並行測試執行

```yaml
name: Parallel Tests

on: [push, pull_request]

jobs:
  test-matrix:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests shard ${{ matrix.shard }}/4
        run: npm run test:e2e -- --shard=${{ matrix.shard }}/4
```

#### 2. 條件執行

```yaml
name: Conditional Tests

on:
  push:
    paths:
      - 'src/**'
      - 'e2e/**'
      - 'package*.json'

jobs:
  check-changes:
    runs-on: ubuntu-latest
    outputs:
      src-changed: ${{ steps.changes.outputs.src }}
      e2e-changed: ${{ steps.changes.outputs.e2e }}
    
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v2
        id: changes
        with:
          filters: |
            src:
              - 'src/**'
            e2e:
              - 'e2e/**'
  
  unit-tests:
    needs: check-changes
    if: needs.check-changes.outputs.src-changed == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test
  
  e2e-tests:
    needs: check-changes
    if: needs.check-changes.outputs.e2e-changed == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test:e2e
```

## GitLab CI 設置

建立 `.gitlab-ci.yml`：

```yaml
stages:
  - test
  - build
  - deploy

variables:
  npm_config_cache: "$CI_PROJECT_DIR/.npm"

cache:
  key:
    files:
      - package-lock.json
  paths:
    - .npm
    - node_modules/

unit-test:
  stage: test
  image: node:20
  script:
    - npm ci
    - npm run test:coverage
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  artifacts:
    reports:
      junit:
        - test-results/junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

e2e-test:
  stage: test
  image: mcr.microsoft.com/playwright:v1.40.0-jammy
  script:
    - npm ci
    - npm run test:e2e
  artifacts:
    when: always
    paths:
      - playwright-report/
    expire_in: 1 week

build:
  stage: build
  image: node:20
  needs: ["unit-test", "e2e-test"]
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
```

## Jenkins Pipeline

建立 `Jenkinsfile`：

```groovy
pipeline {
    agent any
    
    environment {
        NODE_VERSION = '20'
    }
    
    stages {
        stage('Setup') {
            steps {
                nodejs(nodeJSInstallationName: "Node ${NODE_VERSION}") {
                    sh 'npm ci'
                }
            }
        }
        
        stage('Parallel Tests') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        nodejs(nodeJSInstallationName: "Node ${NODE_VERSION}") {
                            sh 'npm run test:coverage'
                        }
                    }
                    post {
                        always {
                            junit 'test-results/**/*.xml'
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'coverage',
                                reportFiles: 'index.html',
                                reportName: 'Coverage Report'
                            ])
                        }
                    }
                }
                
                stage('E2E Tests') {
                    steps {
                        nodejs(nodeJSInstallationName: "Node ${NODE_VERSION}") {
                            sh 'npx playwright install --with-deps'
                            sh 'npm run test:e2e'
                        }
                    }
                    post {
                        always {
                            publishHTML([
                                reportDir: 'playwright-report',
                                reportFiles: 'index.html',
                                reportName: 'Playwright Report'
                            ])
                        }
                    }
                }
            }
        }
        
        stage('Build') {
            when {
                allOf {
                    branch 'main'
                    expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
                }
            }
            steps {
                nodejs(nodeJSInstallationName: "Node ${NODE_VERSION}") {
                    sh 'npm run build'
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}
```

## Docker 整合

### Dockerfile for Testing

```dockerfile
# Dockerfile.test
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

# 複製 package files
COPY package*.json ./

# 安裝依賴
RUN npm ci

# 複製源代碼
COPY . .

# 執行測試
CMD ["npm", "run", "test:all"]
```

### Docker Compose 設置

```yaml
# docker-compose.test.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=test
    networks:
      - test-network

  test-runner:
    build:
      context: .
      dockerfile: Dockerfile.test
    environment:
      - BASE_URL=http://app:3000
    depends_on:
      - app
    networks:
      - test-network
    volumes:
      - ./test-results:/app/test-results
      - ./coverage:/app/coverage

networks:
  test-network:
    driver: bridge
```

## 測試報告和監控

### 1. 測試報告生成

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    reporters: ['default', 'json', 'html', 'junit'],
    outputFile: {
      json: './test-results/vitest-results.json',
      html: './test-results/index.html',
      junit: './test-results/junit.xml'
    }
  }
})

// playwright.config.ts
export default defineConfig({
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/playwright-results.json' }],
    ['junit', { outputFile: 'test-results/playwright-junit.xml' }]
  ]
})
```

### 2. 覆蓋率門檻

```json
// package.json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      },
      "src/components/": {
        "branches": 90,
        "functions": 90,
        "lines": 90,
        "statements": 90
      }
    }
  }
}
```

### 3. 測試趨勢追蹤

```yaml
# GitHub Actions 範例
- name: Test History
  uses: actions/upload-artifact@v3
  with:
    name: test-history
    path: |
      test-results/
      coverage/
    
- name: Download previous results
  uses: actions/download-artifact@v3
  with:
    name: test-history
    path: previous-results/

- name: Generate trend report
  run: |
    node scripts/generate-test-trends.js \
      --current ./test-results \
      --previous ./previous-results \
      --output ./test-trends.html
```

## 性能測試整合

### 1. Lighthouse CI

```yaml
name: Lighthouse CI

on: [push]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build app
        run: npm run build
      
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
```

### 2. 負載測試

```yaml
# k6 負載測試
load-test:
  stage: test
  image: loadimpact/k6
  script:
    - k6 run tests/load/spike-test.js
  artifacts:
    reports:
      performance: k6-results.json
```

## 安全掃描

### 1. 依賴檢查

```yaml
- name: Security audit
  run: |
    npm audit --audit-level=moderate
    npx snyk test
```

### 2. 代碼掃描

```yaml
- name: CodeQL Analysis
  uses: github/codeql-action/analyze@v2
  with:
    languages: javascript, typescript
```

## 部署前檢查

### Pre-deployment Checklist

```yaml
deploy-check:
  runs-on: ubuntu-latest
  steps:
    - name: Check test coverage
      run: |
        COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
        if (( $(echo "$COVERAGE < 80" | bc -l) )); then
          echo "Coverage too low: $COVERAGE%"
          exit 1
        fi
    
    - name: Check E2E test pass rate
      run: |
        PASS_RATE=$(cat test-results/summary.json | jq '.passRate')
        if (( $(echo "$PASS_RATE < 95" | bc -l) )); then
          echo "E2E pass rate too low: $PASS_RATE%"
          exit 1
        fi
    
    - name: Check build size
      run: |
        MAX_SIZE=5000000  # 5MB
        ACTUAL_SIZE=$(du -sb dist | cut -f1)
        if [ $ACTUAL_SIZE -gt $MAX_SIZE ]; then
          echo "Build size too large: $ACTUAL_SIZE bytes"
          exit 1
        fi
```

## 環境變數管理

### 1. 測試環境變數

```bash
# .env.test
VITE_API_URL=http://localhost:3001
VITE_TEST_MODE=true
TEST_TIMEOUT=30000
```

### 2. CI 環境變數

```yaml
env:
  NODE_ENV: test
  CI: true
  FORCE_COLOR: 1
  TEST_RETRY_COUNT: 2
```

## 通知和報警

### 1. Slack 通知

```yaml
- name: Notify Slack
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: |
      Test failed in ${{ github.repository }}
      Branch: ${{ github.ref }}
      Commit: ${{ github.sha }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 2. 郵件通知

```groovy
// Jenkins
post {
    failure {
        emailext (
            subject: "Build Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
            body: """
                <p>Build failed for ${env.JOB_NAME}</p>
                <p>Check console output at ${env.BUILD_URL}</p>
            """,
            to: "${env.CHANGE_AUTHOR_EMAIL}"
        )
    }
}
```

## 最佳實踐總結

1. **快速反饋**：優化測試執行時間，提供快速反饋
2. **並行執行**：利用並行執行縮短總測試時間
3. **增量測試**：只測試變更的部分
4. **測試隔離**：確保測試環境的一致性和隔離性
5. **結果可視化**：提供清晰的測試報告和趨勢
6. **自動重試**：對不穩定的測試自動重試
7. **監控和報警**：及時通知相關人員測試失敗