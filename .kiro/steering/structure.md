# Project Structure & Architecture

## Directory Organization

```
src/
├── components/          # Shared/reusable components
│   ├── Layout.tsx      # Main application layout with navigation
│   ├── FormBuilder.tsx # Dynamic form creation component
│   ├── FormViewer.tsx  # Form display and submission component
│   └── FormSubmissionsView.tsx # Form data management
├── pages/              # Route-level page components
│   ├── Dashboard.tsx   # Main dashboard with real-time updates
│   ├── Spreadsheet.tsx # Excel-like spreadsheet editor
│   ├── Permissions.tsx # Permission management (RBAC/ABAC)
│   ├── Workflows.tsx   # Visual workflow editor
│   ├── Analytics.tsx   # Analytics and reporting dashboard
│   ├── AITools.tsx     # AI-powered features and insights
│   └── Settings.tsx    # System configuration
├── stores/             # Zustand state management
│   └── formStore.ts    # Form-related global state
├── types/              # TypeScript type definitions
│   └── form.ts         # Form-related types
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Architecture Patterns

### Component Organization
- **Pages**: Route-level components in `src/pages/`
- **Components**: Reusable UI components in `src/components/`
- **Layout**: Single layout component wrapping all pages
- **Routing**: Nested routes with Layout as parent

### State Management
- **Global State**: Zustand stores in `src/stores/`
- **Local State**: React hooks within components
- **Form State**: Dedicated form store for complex form logic

### Type System
- **Comprehensive Types**: Based on original templates with enterprise features
- **Permission System**: Support for both RBAC and ABAC models
- **Formula Engine**: Type-safe formula calculations with dependencies
- **Workflow Types**: Status transitions and automation rules

### Styling Conventions
- **Tailwind Classes**: Utility-first CSS approach
- **Dark Theme**: Default dark mode with gray color palette
- **Custom Animations**: Slide-in and fade-in transitions
- **Responsive Design**: Mobile-first responsive layouts

## Key Architectural Decisions

### Routing Structure
- Root redirect to `/dashboard`
- Optional parameters for dynamic routes (e.g., `/spreadsheet/:id?`)
- Separate form viewer route outside main layout

### Permission Architecture
- Rule-based permission engine with priority system
- Support for dynamic conditions using JavaScript expressions
- Separate evaluation for table, row, and column permissions

### Performance Optimizations
- Virtual scrolling for large datasets
- Formula result caching with dependency tracking
- Component-level state management to minimize re-renders
- Lazy loading for feature modules

## File Naming Conventions
- **Components**: PascalCase (e.g., `FormBuilder.tsx`)
- **Pages**: PascalCase (e.g., `Dashboard.tsx`)
- **Stores**: camelCase (e.g., `formStore.ts`)
- **Types**: camelCase (e.g., `form.ts`)
- **Utilities**: camelCase for files, PascalCase for classes