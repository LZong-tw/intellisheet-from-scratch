# Technology Stack

## Frontend Framework
- **React 18** with TypeScript for type safety
- **React Router v6** for client-side routing
- **Vite** as the build tool and dev server

## State Management
- **Zustand** for global state management
- React Hooks and Context for local state
- Form state managed in dedicated stores (`src/stores/`)

## UI & Styling
- **Tailwind CSS** as the primary CSS framework
- **Headless UI** for accessible component primitives
- **Framer Motion** for animations and transitions
- **Lucide React** for consistent iconography
- Dark mode support with custom color palette

## Data & Tables
- **@tanstack/react-table** for advanced table functionality
- **@tanstack/react-virtual** for virtual scrolling performance
- **@dnd-kit** for drag-and-drop interactions
- **Recharts** for data visualization and charts

## Development Tools
- **TypeScript 5.3+** with strict mode enabled
- **ESLint** and path aliases (`@/*` → `./src/*`)
- Hot module replacement via Vite
- Custom PostCSS configuration

## Common Commands

```bash
# Development
npm run dev          # Start development server on port 3000
npm start           # Alias for npm run dev

# Build & Deploy
npm run build       # Production build
npm run preview     # Preview production build

# Setup
npm install         # Install dependencies
npm run setup       # Install + seed data
npm run seed        # Seed development data

# Platform-specific quick start
./start.sh          # Linux/macOS
.\start.ps1         # Windows PowerShell
```

## Performance Considerations
- Virtual scrolling for large datasets (100K+ rows)
- Smart caching to reduce re-renders
- Lazy loading for feature modules
- Formula calculation with result caching
- Real-time updates optimized for collaboration