# IntelliSheet Platform - Quick Start Script (PowerShell)

Write-Host "🚀 Welcome to IntelliSheet Platform v2.0" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = Get-Command node -ErrorAction Stop
    Write-Host "✅ Node.js found at: $($nodeVersion.Source)" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 16+ first." -ForegroundColor Red
    Write-Host "📥 Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check Node.js version
try {
    $nodeVersionOutput = node -v
    $majorVersion = [int]($nodeVersionOutput -replace "v(\d+)\..*", '$1')
    
    if ($majorVersion -lt 16) {
        Write-Host "❌ Node.js version 16+ is required. Current version: $nodeVersionOutput" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Node.js $nodeVersionOutput detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Could not determine Node.js version" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check and fix PostCSS config
if (Test-Path "postcss.config.js") {
    $postcssContent = Get-Content "postcss.config.js" -Raw
    if ($postcssContent -match "export default") {
        Write-Host "🔧 Fixing PostCSS configuration..." -ForegroundColor Yellow
        $fixedContent = $postcssContent -replace "export default", "module.exports ="
        Set-Content -Path "postcss.config.js" -Value $fixedContent -Encoding UTF8
        Write-Host "✅ PostCSS config updated to CommonJS format" -ForegroundColor Green
        Write-Host ""
    }
}

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

# Create logo file if it doesn't exist
if (-not (Test-Path "public")) {
    New-Item -ItemType Directory -Path "public" -Force | Out-Null
}

if (-not (Test-Path "public/logo.svg")) {
    $logoContent = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
  <line x1="3" y1="9" x2="21" y2="9"></line>
  <line x1="3" y1="15" x2="21" y2="15"></line>
  <line x1="9" y1="3" x2="9" y2="21"></line>
  <line x1="15" y1="3" x2="15" y2="21"></line>
</svg>
'@
    
    Set-Content -Path "public/logo.svg" -Value $logoContent -Encoding UTF8
    Write-Host "✅ Created logo.svg file" -ForegroundColor Green
}

Write-Host "🎯 Starting IntelliSheet Platform..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📌 Features available:" -ForegroundColor White
Write-Host "   • Excel-like Spreadsheet Editor" -ForegroundColor Gray
Write-Host "   • Dynamic Permission Management (RBAC/ABAC)" -ForegroundColor Gray
Write-Host "   • Workflow Automation" -ForegroundColor Gray
Write-Host "   • Real-time Analytics" -ForegroundColor Gray
Write-Host "   • AI-powered Insights" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Opening http://localhost:3000 in your browser..." -ForegroundColor Cyan
Write-Host ""

# Start the development server
Write-Host "🚀 Launching development server..." -ForegroundColor Cyan
npm run dev

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ IntelliSheet Platform stopped successfully" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Development server encountered an error" -ForegroundColor Red
    Write-Host "💡 Troubleshooting tips:" -ForegroundColor Yellow
    Write-Host "   • Check if port 3000 is already in use" -ForegroundColor Gray
    Write-Host "   • Verify all dependencies are installed: npm install" -ForegroundColor Gray
    Write-Host "   • Check for configuration errors above" -ForegroundColor Gray
    Write-Host "   • Try running: npm audit fix" -ForegroundColor Gray
    exit 1
}