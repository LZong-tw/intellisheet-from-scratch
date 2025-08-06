#!/bin/bash

# IntelliSheet Platform - Quick Start Script

echo "🚀 Welcome to IntelliSheet Platform v2.0"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check and fix PostCSS config
if [ -f "postcss.config.js" ]; then
    if grep -q "export default" postcss.config.js; then
        echo "🔧 Fixing PostCSS configuration..."
        sed -i.bak 's/export default/module.exports =/g' postcss.config.js
        echo "✅ PostCSS config updated to CommonJS format"
        echo ""
    fi
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Create logo file if it doesn't exist
if [ ! -f "public/logo.svg" ]; then
    mkdir -p public
    cat > public/logo.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
  <line x1="3" y1="9" x2="21" y2="9"></line>
  <line x1="3" y1="15" x2="21" y2="15"></line>
  <line x1="9" y1="3" x2="9" y2="21"></line>
  <line x1="15" y1="3" x2="15" y2="21"></line>
</svg>
EOF
fi

echo "🎯 Starting IntelliSheet Platform..."
echo ""
echo "📌 Features available:"
echo "   • Excel-like Spreadsheet Editor"
echo "   • Dynamic Permission Management (RBAC/ABAC)"
echo "   • Workflow Automation"
echo "   • Real-time Analytics"
echo "   • AI-powered Insights"
echo ""
echo "🌐 Opening http://localhost:3000 in your browser..."
echo ""

# Start the development server
echo "🚀 Launching development server..."
if npm run dev; then
    echo ""
    echo "✅ IntelliSheet Platform stopped successfully"
else
    echo ""
    echo "❌ Development server encountered an error"
    echo "💡 Troubleshooting tips:"
    echo "   • Check if port 3000 is already in use"
    echo "   • Verify all dependencies are installed: npm install"
    echo "   • Check for configuration errors above"
    exit 1
fi