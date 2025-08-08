# IntelliSheet v2.0 - Requirements

## Functional Requirements (FR)

Spreadsheet
- FR-S-1: Edit cell values inline with keyboard navigation
- FR-S-2: Evaluate formulas (e.g., `=A1+B1`) and display results
- FR-S-3: Sort and filter columns
- FR-S-4: Import CSV into current sheet
- FR-S-5: Export current sheet to CSV
- FR-S-6: Auto-save operations to state

Permissions
- FR-P-1: Support RBAC matrix editing
- FR-P-2: Support ABAC rules with conditions and priorities
- FR-P-3: Evaluate permissions in real-time using user/resource attributes
- FR-P-4: Visualize effective permissions in the UI

Workflows
- FR-W-1: Provide drag-and-drop workflow editor with node palette
- FR-W-2: Triggers include: row_created, row_updated, field_changed, schedule, webhook
- FR-W-3: Actions include: update_field, create_row, send_email, call_webhook, run_script
- FR-W-4: Conditional logic with branches
- FR-W-5: Test and save workflows

Analytics
- FR-A-1: Time range selection and comparison
- FR-A-2: Render charts and KPIs that react to filters
- FR-A-3: Configurable dashboard cards

AI Assistant
- FR-I-1: Prompt input and response display
- FR-I-2: Show insights like anomalies and trends

Settings
- FR-SET-1: Configure webhook URL and API placeholders
- FR-SET-2: Persist preferences locally

## Non-Functional Requirements (NFR)
- NFR-1: Performance – Virtualize large tables; smooth scroll for 100K+ rows
- NFR-2: Reliability – No uncaught exceptions in common UI flows
- NFR-3: Usability – Consistent dark theme, clear affordances
- NFR-4: Compatibility – Node >=16, modern evergreen browsers
- NFR-5: Observability – Basic logging in dev; error boundaries in UI
- NFR-6: Testability – Unit tests for components/hooks; E2E flows for key pages
- NFR-7: Accessibility – Keyboard navigation and ARIA where applicable

## Constraints
- React 18 + TypeScript, Vite, Tailwind (see `.kiro/steering/tech.md`)
- File organization per `.kiro/steering/structure.md`
- Use `zustand` stores for complex local state

## Acceptance Criteria (by page)

Spreadsheet (`src/pages/Spreadsheet.tsx`)
- AC-S-1: Editing a cell updates immediately
- AC-S-2: Entering `=1+2` displays 3 in cell
- AC-S-3: CSV import increases row count and renders rows
- AC-S-4: Export downloads a CSV file

Permissions (`src/pages/Permissions.tsx`)
- AC-P-1: Switching RBAC/ABAC mode updates the editor UI
- AC-P-2: Creating a rule shows in list; reordering changes evaluation order
- AC-P-3: Simulated evaluation reflects rule effect

Workflows (`src/pages/Workflows.tsx`)
- AC-W-1: Dragging a trigger/action node adds it to canvas
- AC-W-2: Node config modal saves and reflects in node label
- AC-W-3: Test run shows success/failure indicators

Analytics (`src/pages/Analytics.tsx`)
- AC-A-1: Time range change rerenders charts
- AC-A-2: Toggling compare updates KPIs

AI Tools (`src/pages/AITools.tsx`)
- AC-I-1: Entering a prompt renders a response placeholder

Settings (`src/pages/Settings.tsx`)
- AC-SET-1: Webhook URL field validates URL format
- AC-SET-2: Saving persists value to local state

## Testing & QA
- Unit: `npm run test`, `npm run test:coverage`
- E2E: `npm run test:e2e` (UI mode: `npm run test:e2e:ui`)
- Specific E2E file: `npm run test:e2e -- e2e/<file>.spec.ts`
- Success criteria: All unit tests pass; critical E2E paths green (Dashboard, Spreadsheet, Permissions)

## Deliverables
- Working pages as per specs
- Configured scripts (see `package.json`)
- Documentation in `.kiro/` and `README.md`