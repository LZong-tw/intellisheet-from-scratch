# IntelliSheet Platform v2.0

> Next-generation intelligent spreadsheet platform - Combining Excel's ease of use with enterprise-grade permission control

![IntelliSheet](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen)

## 🚀 Quick Start

### Linux/macOS Users
```bash
# Clone the project
git clone <your-repo-url>
cd <repo-name>

# One-click start
./start.sh

# Or manual start
npm install
npm run dev
```

### Windows Users
```powershell
# Clone the project
git clone <your-repo-url>
cd <repo-name>

# One-click start (PowerShell)
.\start.ps1

# If execution policy restrictions apply, use
powershell -ExecutionPolicy Bypass -File start.ps1

# Or manual start
npm install
npm run dev
```

Visit http://localhost:3000 to start using it!

## 🎯 Core Features

### 1. Excel-like Spreadsheet Editing
- ✅ Direct cell click editing
- ✅ Formula calculation support (e.g., =A1+B1)
- ✅ Copy/paste and undo/redo functionality
- ✅ Column sorting and filtering
- ✅ Real-time auto-save
- ✅ CSV file import/export

### 2. Dynamic Permission Management
- ✅ **Simple Mode**: Traditional role-based access control (RBAC)
- ✅ **Advanced Mode**: Attribute-based access control (ABAC)
- ✅ State-driven dynamic permissions
- ✅ Real-time permission evaluation engine

### 3. Workflow Automation
- ✅ Visual workflow editor
- ✅ Drag-and-drop node design
- ✅ Event triggers and conditional logic
- ✅ Deep integration with spreadsheets
- ✅ Testing and saving functionality

### 4. Real-time Analytics Dashboard
- ✅ Real-time data visualization
- ✅ Custom report generator
- ✅ Performance monitoring metrics
- ✅ User behavior analytics
- ✅ Time range selection and comparison mode

### 5. AI Intelligent Assistant
- ✅ Anomaly detection and alerts
- ✅ Trend prediction and analysis
- ✅ Natural language queries
- ✅ Intelligent data suggestions
- ✅ AI task automation

## 📁 Project Structure

```
.
├── src/
│   ├── components/        # Shared components
│   │   └── Layout.tsx     # Main layout
│   ├── pages/            # Page components
│   │   ├── Dashboard.tsx      # Dashboard (with real-time updates)
│   │   ├── Spreadsheet.tsx    # Spreadsheet editor (with formula support)
│   │   ├── Permissions.tsx    # Permission management
│   │   ├── Workflows.tsx      # Workflows (with visual editor)
│   │   ├── Analytics.tsx      # Analytics reports (with interactive charts)
│   │   ├── AITools.tsx        # AI tools (with real-time insights)
│   │   └── Settings.tsx       # System settings
│   ├── App.tsx           # Main application
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── original-templates/   # Original template files
│   ├── advanced analytics dashboard.ts
│   ├── ai-powered features dashboard.ts
│   ├── collaboration engine.ts
│   ├── core type system.ts
│   ├── intellisheet cli.ts
│   ├── intellisheet sdk.ts
│   ├── intellisheet solution templates.ts
│   ├── schema as code.ts
│   ├── virtual scrolling performance table.ts
│   └── workflow automation engine.ts
├── package.json          # Project configuration
├── start.sh             # Quick start script (Linux/macOS)
├── start.ps1            # Quick start script (Windows PowerShell)
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite build configuration
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Routing**: React Router v6
- **State Management**: React Hooks + Context
- **UI Framework**: Tailwind CSS
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Build Tool**: Vite

## 🎨 Usage Examples

### Create New Spreadsheet
1. Click "Create New Sheet" on Dashboard
2. Click directly on cells to start editing
3. Use formula bar to input formulas (e.g., =E2+F2)
4. Use Ctrl+C/V for copy/paste, Ctrl+Z/Y for undo/redo

### Configure Permission Rules
1. Go to Permissions page
2. Choose Simple Matrix or Advanced ABAC mode
3. Configure role permissions or create dynamic rules

### Create Automated Workflows
1. Go to Workflows page
2. Click "Create Workflow"
3. Drag nodes from left panel to canvas
4. Click nodes to configure
5. Test and save workflow

## 🔐 Permission System

### Simple Matrix Mode
- Suitable for organizations with fixed roles
- Intuitive permission matrix configuration
- Batch permission operations support

### Advanced ABAC Mode
- Dynamic permissions based on user attributes
- Complex conditional expressions support
- Real-time permission evaluation

Example rules:
```javascript
// Department managers can edit their department's data
user.role === "Manager" && user.department === resource.department

// Data owners have full permissions
user.id === resource.ownerId

// Access only during work hours
currentTime >= "09:00" && currentTime <= "18:00"
```

## 📊 Performance Optimization

- **Virtual Scrolling**: Smooth browsing of 100K+ rows of data
- **Smart Caching**: Reduces unnecessary re-renders
- **Lazy Loading**: Load feature modules on demand
- **Formula Calculation**: Real-time calculation and result caching

## 🚧 Development Roadmap

- [ ] Offline mode support
- [ ] Mobile device optimization
- [ ] More AI features
- [ ] Third-party integration APIs
- [ ] Multi-language support

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Issues and Pull Requests are welcome!

---

**IntelliSheet** - Making spreadsheets smarter and more powerful!