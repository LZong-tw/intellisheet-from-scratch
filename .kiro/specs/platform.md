# IntelliSheet v2.0 - Functional Specs

## Overview
IntelliSheet is an intelligent spreadsheet platform combining Excel-like editing with enterprise-grade permissions, workflow automation, analytics, and AI assistance. This document defines functional specifications aligned with the current codebase.

- App entry and routing: `src/App.tsx`, `src/main.tsx`
- Pages: `src/pages/Spreadsheet.tsx`, `src/pages/Permissions.tsx`, `src/pages/Workflows.tsx`, `src/pages/Analytics.tsx`, `src/pages/AITools.tsx`, `src/pages/Settings.tsx`, `src/pages/Dashboard.tsx`
- Shared components: `src/components/*`
- State: `src/stores/formStore.ts`

## In-Scope Features
- Spreadsheet editing with formulas, sorting, filtering, import/export
- Permissions (RBAC/ABAC) with rule-based evaluation
- Visual workflow builder (triggers, conditions, actions)
- Analytics dashboard and reports
- AI assistant features
- Settings for system configuration

## Feature Specs

### Spreadsheet
- Cell editing: direct click-to-edit, keyboard navigation
- Formulas: evaluate typical expressions like `=A1+B1`; display results in cells
- Copy/paste, undo/redo
- Sorting/filtering per column
- Import/export CSV
- Auto-save to local state or backend placeholder
- Virtual scrolling for large datasets (target 100K+ rows)

User Stories
- As a user, I can edit a cell and see the new value immediately
- As a user, I can input a formula and see computed results
- As a user, I can import CSV and see rows rendered
- As a user, I can export current sheet to CSV

Acceptance (high level)
- Editing, formulas, sorting/filtering, import/export demonstrated on `Spreadsheet` page

### Permissions (RBAC/ABAC)
- Simple Mode (RBAC): role-to-action mapping
- Advanced Mode (ABAC): rule expressions with priority, scope (table/row/column)
- Real-time evaluation based on current user + resource attributes
- UI to view and modify rules

User Stories
- As an admin, I can define role permissions (RBAC)
- As an admin, I can define attribute-based rules (ABAC)
- As a user, my available actions reflect evaluated permissions

Acceptance (high level)
- RBAC matrix editable; ABAC rules can be created, ordered, and evaluated visibly in `Permissions`

### Workflow Automation
- Visual editor with nodes for triggers, conditions, actions
- Triggers: row created/updated, field changed, schedule, webhook
- Conditions: if/else branches with expressions
- Actions: update field/create row, send email, call webhook, run script
- Test and save workflow definitions

User Stories
- As a user, I can compose a workflow by dragging nodes
- As a user, I can configure node properties
- As a user, I can test a workflow and see simulated results

Acceptance (high level)
- Triggers and actions selectable; can persist a draft; test mode visible in `Workflows`

### Analytics
- Real-time charts, metrics, time-range selection, comparisons
- Create configurable dashboard cards

User Stories
- As a user, I can view KPIs and charts updated with data filters
- As a user, I can adjust time windows and compare periods

Acceptance (high level)
- Charts render and respond to time range in `Analytics`

### AI Assistant
- Natural language prompts for queries, suggestions
- Anomaly detection and trend hints
- Task automation stubs

Acceptance (high level)
- `AITools` page shows prompt input and result display

### Settings
- System-wide configuration UI
- Webhook URL fields, API keys placeholders

Acceptance (high level)
- `Settings` page can persist basic preferences in local state

## Out of Scope (for now)
- Server-side persistence and real auth
- Complex multi-tenant data isolation
- Production-grade email/webhook providers

## Cross-cutting Behavior
- Dark theme, Tailwind-based UI
- Framer Motion animations for transitions
- Lucide icons for consistent iconography

## References
- Product: `.kiro/steering/product.md`
- Structure: `.kiro/steering/structure.md`
- Tech: `.kiro/steering/tech.md`