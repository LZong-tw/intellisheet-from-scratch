# IntelliSheet v2.0 - Design

## System Overview
- React 18 + TypeScript, Vite
- Routing with React Router: `src/App.tsx`
- Dark-themed UI with Tailwind; animations with Framer Motion; icons via Lucide
- State: local component state + `zustand` (e.g., `src/stores/formStore.ts`)

## Architecture
- Pages (`src/pages/*`) host feature modules: `Spreadsheet`, `Permissions`, `Workflows`, `Analytics`, `AITools`, `Settings`, `Dashboard`
- Reusable components in `src/components/*` like `FormBuilder`, `FormViewer`, `FormSubmissionsView`, `Layout`
- Types located in `src/types/*` (extend per needs). Rich type inspiration in `original-templates/*`

### Data Flow
- UI events → local state/update stores → render
- No real backend in scope; mock and local state-driven flows
- Import/export CSV via browser APIs

### Spreadsheet Design
- Virtualized table rendering for performance
- Formula evaluation pipeline with caching of results and dependency tracking (future extension)
- Sorting/filtering applied at view layer

### Permission Engine Design
- Modes: RBAC and ABAC
- ABAC rules: ordered list with conditions evaluated against `user` and `resource`
- Evaluation model: first matching rule wins or priority-based merge strategy
- UI provides matrix editor (RBAC) and rule editor (ABAC)

### Workflow Builder Design
- Palette: triggers, conditions, actions
- Node model contains `id`, `type`, `name`, and `config`
- Triggers: `row_created | row_updated | field_changed | schedule | webhook`
- Actions: `update_field | create_row | send_email | call_webhook | run_script`
- Test mode simulates execution: validate node graph, run step-by-step with statuses

### Analytics Design
- Dashboard layout with cards/kpis/charts
- Time context provider to broadcast time-range and comparison selection

### AI Tools Design
- Prompt input connected to placeholder inference result renderer
- Extensible interface for future model providers

### Settings Design
- Configuration inputs (e.g., webhook URL) persisted to local store

## State Management
- Use `zustand` for complex state (forms, workflow drafts)
- Keep components controlled; lift state when needed
- Derive UI state via selectors to avoid unnecessary re-renders

## Error Handling & UX
- Input validation before save
- Friendly toasts/messages on success/failure
- Guard against invalid workflow graphs (dangling nodes or cycles)

## Extensibility
- Add new workflow node types by extending palette and config forms in `Workflows`
- Add new permission evaluators by extending ABAC rule handlers
- Add new analytics cards by implementing a card component and registering it

## Testing Strategy
- Unit: components and hooks with `@testing-library/react` and `vitest`
- E2E: key user journeys with `@playwright/test`
- CI commands: `npm run test:all`, report via Playwright

## Key Files
- `src/pages/Spreadsheet.tsx` – grid UI and formula handling
- `src/pages/Permissions.tsx` – RBAC/ABAC editors and evaluators
- `src/pages/Workflows.tsx` – visual workflow designer
- `src/pages/Analytics.tsx` – analytics dashboard
- `src/pages/AITools.tsx` – prompt and insights UI
- `src/components/FormBuilder.tsx` – dynamic form builder
- `src/stores/formStore.ts` – form-related global state

## References
- `.kiro/steering/product.md`, `.kiro/steering/structure.md`, `.kiro/steering/tech.md`
- `README.md` for quick start and high-level features