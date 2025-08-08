# IntelliSheet Agent Hooks for Kiro

## Overview

This document defines the hooks and integration points that Kiro can use to interact with the IntelliSheet platform. These hooks provide structured ways for AI agents to understand, modify, and extend the codebase while maintaining consistency and quality.

## 1. Project Context Hooks

### 1.1 Project Structure Hook
```yaml
hook: project_structure
description: Understand the project organization and file structure
entry_points:
  - path: /workspace/.kiro/steering/
    description: Kiro-specific configuration and guidance files
  - path: /workspace/src/
    description: Main source code directory
  - path: /workspace/docs/
    description: Documentation files
  - path: /workspace/original-templates/
    description: Reference templates for features
patterns:
  - "**/*.tsx": React components with TypeScript
  - "**/*.ts": TypeScript files (utils, types, stores)
  - "**/*.md": Documentation files
  - "**/types/*.ts": Type definitions
```

### 1.2 Technology Stack Hook
```yaml
hook: tech_stack
description: Current and planned technology choices
current:
  frontend:
    framework: React 18
    language: TypeScript
    state: Zustand
    styling: Tailwind CSS
    build: Vite
    testing: Vitest, Playwright
  backend:
    status: not_implemented
    planned:
      runtime: Node.js
      framework: Express.js
      orm: Prisma
      database: PostgreSQL (Aurora Serverless v2)
```

### 1.3 Feature Status Hook
```yaml
hook: feature_status
description: Track implementation status of features
features:
  spreadsheet_core:
    status: partial
    implemented:
      - Basic grid display
      - Cell selection
      - Simple editing
    pending:
      - Formula engine
      - Import/export
      - Virtual scrolling optimization
  permissions:
    status: partial
    implemented:
      - UI components
      - Basic RBAC display
    pending:
      - Backend integration
      - ABAC engine
      - Real-time evaluation
  workflow_automation:
    status: ui_only
    implemented:
      - Visual designer UI
      - Node types
    pending:
      - Execution engine
      - Backend integration
      - Monitoring
  analytics:
    status: ui_only
    implemented:
      - Dashboard layout
      - Chart components
    pending:
      - Real-time data
      - Backend integration
  ai_features:
    status: ui_only
    implemented:
      - UI mockups
    pending:
      - All AI functionality
```

## 2. Code Generation Hooks

### 2.1 Component Creation Hook
```typescript
interface ComponentCreationHook {
  type: 'page' | 'component' | 'hook' | 'store';
  name: string;
  path: string;
  template: string;
  imports: string[];
  props?: TypeDefinition;
  state?: StateDefinition;
}

// Example usage:
const createSpreadsheetComponent: ComponentCreationHook = {
  type: 'component',
  name: 'SpreadsheetCell',
  path: 'src/components/spreadsheet/SpreadsheetCell.tsx',
  template: 'functional-component',
  imports: [
    'react',
    '@/types/spreadsheet',
    '@/hooks/useSpreadsheet'
  ],
  props: {
    rowIndex: 'number',
    colIndex: 'number',
    value: 'string | number | null',
    formula?: 'string',
    style?: 'CellStyle'
  }
};
```

### 2.2 API Endpoint Hook
```typescript
interface APIEndpointHook {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  handler: string;
  middleware: string[];
  validation?: ValidationSchema;
  response: ResponseType;
}

// Example for future backend:
const cellUpdateEndpoint: APIEndpointHook = {
  method: 'PUT',
  path: '/api/v1/spreadsheets/:id/cells',
  handler: 'updateCells',
  middleware: ['authenticate', 'authorize', 'validateSpreadsheetAccess'],
  validation: {
    body: {
      cells: 'CellUpdate[]'
    }
  },
  response: {
    success: 'UpdatedCell[]',
    error: 'ErrorResponse'
  }
};
```

### 2.3 Type Definition Hook
```typescript
interface TypeDefinitionHook {
  name: string;
  path: string;
  definition: string;
  imports?: string[];
  exports: 'default' | 'named' | 'both';
}

// Example:
const spreadsheetTypes: TypeDefinitionHook = {
  name: 'SpreadsheetTypes',
  path: 'src/types/spreadsheet.ts',
  definition: `
    export interface Cell {
      rowIndex: number;
      colIndex: number;
      value: CellValue;
      formula?: string;
      computed?: CellValue;
      style?: CellStyle;
      locked?: boolean;
    }
    
    export type CellValue = string | number | boolean | null;
  `,
  exports: 'named'
};
```

## 3. Testing Hooks

### 3.1 Test Creation Hook
```yaml
hook: test_creation
description: Guidelines for creating tests
patterns:
  unit_tests:
    location: "**/*.test.ts"
    framework: vitest
    conventions:
      - Test files next to source files
      - Use describe blocks for grouping
      - Mock external dependencies
      - Test edge cases
  integration_tests:
    location: "tests/integration/"
    framework: vitest
    conventions:
      - Test API endpoints
      - Use test database
      - Clean up after tests
  e2e_tests:
    location: "e2e/"
    framework: playwright
    conventions:
      - Test user journeys
      - Use page object pattern
      - Run against test environment
```

### 3.2 Test Data Hook
```typescript
interface TestDataHook {
  entity: string;
  factory: string;
  samples: any[];
  generators: {
    [key: string]: () => any;
  };
}

// Example:
const spreadsheetTestData: TestDataHook = {
  entity: 'Spreadsheet',
  factory: 'createTestSpreadsheet',
  samples: [
    {
      id: 'test-sheet-1',
      name: 'Sales Report',
      cells: [
        { row: 0, col: 0, value: 'Product' },
        { row: 0, col: 1, value: 'Sales' }
      ]
    }
  ],
  generators: {
    randomCell: () => ({
      row: Math.floor(Math.random() * 100),
      col: Math.floor(Math.random() * 26),
      value: Math.random() > 0.5 ? Math.random() * 1000 : 'Test'
    })
  }
};
```

## 4. State Management Hooks

### 4.1 Store Creation Hook
```typescript
interface StoreCreationHook {
  name: string;
  path: string;
  slices: StoreSlice[];
  persist?: boolean;
  devtools?: boolean;
}

interface StoreSlice {
  name: string;
  state: Record<string, any>;
  actions: Record<string, string>;
  selectors?: Record<string, string>;
}

// Example:
const spreadsheetStore: StoreCreationHook = {
  name: 'spreadsheetStore',
  path: 'src/stores/spreadsheetStore.ts',
  slices: [
    {
      name: 'cells',
      state: {
        data: 'Map<string, Cell>',
        selected: 'CellRef | null',
        editing: 'CellRef | null'
      },
      actions: {
        updateCell: '(ref: CellRef, value: CellValue) => void',
        selectCell: '(ref: CellRef) => void',
        startEditing: '(ref: CellRef) => void'
      },
      selectors: {
        getCellValue: '(ref: CellRef) => CellValue',
        getSelectedCell: '() => Cell | null'
      }
    }
  ],
  persist: true,
  devtools: true
};
```

### 4.2 State Update Hook
```yaml
hook: state_update
description: Patterns for updating application state
patterns:
  - name: optimistic_update
    description: Update UI immediately, sync with server
    example: |
      // Update local state immediately
      updateCell(cellRef, newValue);
      
      // Sync with server
      try {
        await api.updateCell(cellRef, newValue);
      } catch (error) {
        // Revert on failure
        revertCell(cellRef, oldValue);
      }
  
  - name: server_first
    description: Wait for server confirmation
    example: |
      setLoading(true);
      try {
        const result = await api.updateCell(cellRef, newValue);
        updateCell(cellRef, result.value);
      } finally {
        setLoading(false);
      }
```

## 5. UI/UX Hooks

### 5.1 Design System Hook
```yaml
hook: design_system
description: UI consistency guidelines
tokens:
  colors:
    primary: "blue-600"
    secondary: "gray-600"
    success: "green-600"
    warning: "yellow-600"
    error: "red-600"
    background: "gray-900"
    surface: "gray-800"
    text: "gray-100"
  spacing:
    xs: "0.5rem"
    sm: "1rem"
    md: "1.5rem"
    lg: "2rem"
    xl: "3rem"
  typography:
    heading: "font-bold text-2xl"
    subheading: "font-semibold text-lg"
    body: "text-base"
    caption: "text-sm text-gray-400"
components:
  button:
    variants: [primary, secondary, ghost, danger]
    sizes: [sm, md, lg]
  input:
    variants: [default, error, disabled]
  modal:
    sizes: [sm, md, lg, full]
```

### 5.2 Animation Hook
```typescript
interface AnimationHook {
  name: string;
  trigger: 'mount' | 'hover' | 'click' | 'scroll' | 'state';
  animation: AnimationConfig;
  usage: string;
}

// Example:
const slideInAnimation: AnimationHook = {
  name: 'slideIn',
  trigger: 'mount',
  animation: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 }
  },
  usage: 'Use for sidebar, modals, and panels'
};
```

## 6. Performance Hooks

### 6.1 Optimization Hook
```yaml
hook: performance_optimization
description: Performance improvement patterns
strategies:
  - name: virtual_scrolling
    when: "Rendering > 1000 rows"
    implementation: "@tanstack/react-virtual"
    example: "src/components/spreadsheet/VirtualGrid.tsx"
  
  - name: memoization
    when: "Expensive computations or renders"
    implementation: "React.memo, useMemo, useCallback"
    rules:
      - Memo components with complex props
      - useMemo for expensive calculations
      - useCallback for stable function references
  
  - name: code_splitting
    when: "Large feature modules"
    implementation: "React.lazy + Suspense"
    pattern: |
      const Analytics = lazy(() => import('./pages/Analytics'));
  
  - name: debouncing
    when: "Frequent user input"
    implementation: "Custom hook or lodash"
    example: "Search, auto-save, API calls"
```

### 6.2 Monitoring Hook
```typescript
interface MonitoringHook {
  metric: string;
  threshold: number;
  unit: string;
  action: 'log' | 'alert' | 'optimize';
  implementation: string;
}

// Example:
const renderPerformance: MonitoringHook = {
  metric: 'component_render_time',
  threshold: 16,
  unit: 'ms',
  action: 'optimize',
  implementation: `
    if (process.env.NODE_ENV === 'development') {
      const start = performance.now();
      // Component render
      const end = performance.now();
      if (end - start > 16) {
        console.warn(\`Slow render: \${end - start}ms\`);
      }
    }
  `
};
```

## 7. Error Handling Hooks

### 7.1 Error Boundary Hook
```typescript
interface ErrorBoundaryHook {
  level: 'global' | 'feature' | 'component';
  fallback: ComponentType;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  retry?: boolean;
}

// Example:
const spreadsheetErrorBoundary: ErrorBoundaryHook = {
  level: 'feature',
  fallback: SpreadsheetErrorFallback,
  onError: (error, errorInfo) => {
    console.error('Spreadsheet error:', error);
    // Send to error tracking service
  },
  retry: true
};
```

### 7.2 API Error Hook
```yaml
hook: api_error_handling
description: Consistent API error handling
patterns:
  - code: 400
    type: ValidationError
    action: Show inline errors
    retry: false
  
  - code: 401
    type: AuthenticationError
    action: Redirect to login
    retry: false
  
  - code: 403
    type: AuthorizationError
    action: Show permission denied
    retry: false
  
  - code: 404
    type: NotFoundError
    action: Show not found page
    retry: false
  
  - code: 429
    type: RateLimitError
    action: Show rate limit message
    retry: true
    delay: exponential
  
  - code: 500
    type: ServerError
    action: Show error message
    retry: true
    attempts: 3
```

## 8. Integration Hooks

### 8.1 External Service Hook
```typescript
interface ExternalServiceHook {
  name: string;
  type: 'auth' | 'storage' | 'analytics' | 'notification';
  config: ServiceConfig;
  methods: ServiceMethod[];
  errorHandling: ErrorStrategy;
}

// Example:
const googleSheetsIntegration: ExternalServiceHook = {
  name: 'GoogleSheets',
  type: 'storage',
  config: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    scope: ['spreadsheets.readonly']
  },
  methods: [
    {
      name: 'importSheet',
      endpoint: 'GET /spreadsheets/{spreadsheetId}',
      transform: 'googleSheetToIntelliSheet'
    }
  ],
  errorHandling: {
    retry: true,
    fallback: 'showImportError'
  }
};
```

### 8.2 Webhook Registration Hook
```yaml
hook: webhook_registration
description: Register webhooks for events
events:
  - name: spreadsheet.created
    payload:
      id: string
      name: string
      createdBy: string
      timestamp: string
  
  - name: cell.updated
    payload:
      spreadsheetId: string
      cellRef: string
      oldValue: any
      newValue: any
      updatedBy: string
  
  - name: permission.changed
    payload:
      resourceType: string
      resourceId: string
      changes: object
      changedBy: string
```

## 9. Development Workflow Hooks

### 9.1 Code Style Hook
```yaml
hook: code_style
description: Coding standards and conventions
rules:
  naming:
    components: PascalCase
    hooks: camelCase with 'use' prefix
    types: PascalCase
    interfaces: PascalCase with 'I' prefix optional
    constants: UPPER_SNAKE_CASE
    files:
      components: PascalCase.tsx
      hooks: useSomething.ts
      utils: camelCase.ts
      types: camelCase.ts
  
  imports:
    order:
      - React and core libraries
      - Third-party libraries
      - Absolute imports (@/)
      - Relative imports
      - Style imports
    grouping: true
    sorting: alphabetical
  
  components:
    structure:
      - Imports
      - Type definitions
      - Component definition
      - Styled components (if any)
      - Export
```

### 9.2 Git Hook
```yaml
hook: git_workflow
description: Git commit and branch conventions
branches:
  main: Production-ready code
  develop: Integration branch
  feature/*: New features
  fix/*: Bug fixes
  chore/*: Maintenance tasks
  docs/*: Documentation updates

commits:
  format: "<type>(<scope>): <subject>"
  types:
    - feat: New feature
    - fix: Bug fix
    - docs: Documentation
    - style: Code style
    - refactor: Code refactoring
    - test: Tests
    - chore: Maintenance
  examples:
    - "feat(spreadsheet): add formula calculation engine"
    - "fix(permissions): resolve ABAC evaluation bug"
    - "docs(api): update webhook documentation"
```

## 10. Deployment Hooks

### 10.1 Build Hook
```yaml
hook: build_process
description: Build and deployment configuration
environments:
  development:
    command: npm run dev
    variables:
      VITE_API_URL: http://localhost:3001
      VITE_WS_URL: ws://localhost:3001
  
  staging:
    command: npm run build
    variables:
      VITE_API_URL: https://staging-api.intellisheet.com
      VITE_WS_URL: wss://staging-api.intellisheet.com
  
  production:
    command: npm run build
    variables:
      VITE_API_URL: https://api.intellisheet.com
      VITE_WS_URL: wss://api.intellisheet.com
    optimizations:
      - Tree shaking
      - Code splitting
      - Asset compression
      - CDN deployment
```

### 10.2 Health Check Hook
```typescript
interface HealthCheckHook {
  endpoint: string;
  checks: HealthCheck[];
  timeout: number;
  interval: number;
}

interface HealthCheck {
  name: string;
  type: 'api' | 'database' | 'cache' | 'service';
  critical: boolean;
  check: () => Promise<boolean>;
}

// Example:
const healthChecks: HealthCheckHook = {
  endpoint: '/health',
  checks: [
    {
      name: 'database',
      type: 'database',
      critical: true,
      check: async () => {
        // Check database connection
        return true;
      }
    },
    {
      name: 'redis',
      type: 'cache',
      critical: false,
      check: async () => {
        // Check Redis connection
        return true;
      }
    }
  ],
  timeout: 5000,
  interval: 30000
};
```

## Usage Guidelines for Kiro

### 1. Understanding Context
Always check these hooks before making changes:
- `project_structure` - Understand where files belong
- `tech_stack` - Use appropriate technologies
- `feature_status` - Know what's implemented

### 2. Creating New Features
Follow these patterns:
1. Check `feature_status` hook
2. Use `component_creation` hook for new components
3. Follow `design_system` hook for UI consistency
4. Implement tests using `test_creation` hook

### 3. Modifying Existing Code
1. Understand current implementation
2. Follow `code_style` hook
3. Update tests
4. Update documentation

### 4. Performance Considerations
- Check `performance_optimization` hook
- Implement monitoring using `monitoring` hook
- Test with large datasets

### 5. Error Handling
- Use `error_boundary` hook for React components
- Follow `api_error_handling` patterns
- Log errors appropriately

### 6. Integration
- Check `external_service` hook for patterns
- Register webhooks properly
- Handle authentication consistently

Remember: These hooks are living documentation. Update them as the project evolves!