# Testing Guide

This document explains how to run and extend the automated tests that ship with IntelliSheet v2.

---

## 1. Prerequisites

```bash
npm install            # installs all dev-dependencies, including Playwright & Vitest
npx playwright install # one-time – downloads the browser binaries
```

---

## 2. Unit tests (Vitest + React Testing Library)

Run all unit tests:

```bash
npm run test:unit
```

Vitest also ships with an interactive UI – great for TDD:

```bash
npx vitest --ui
```

### Writing new unit tests

* Add files under `src/__tests__/` and end them with `.spec.ts` or `.spec.tsx`.
* Use [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) helpers to render components and make assertions.
* Example template:

```tsx
import { render, screen } from '@testing-library/react'
import MyComponent from '../components/MyComponent'

describe('MyComponent', () => {
  it('shows greeting', () => {
    render(<MyComponent />)
    expect(screen.getByText(/hello/i)).toBeInTheDocument()
  })
})
```

---

## 3. End-to-End tests (Playwright)

Playwright drives real browsers to verify that the whole app works together.

Run the full E2E suite (dev server is started automatically on port 5173):

```bash
npm run test:e2e
```

Headed / slow-mo debugging:

```bash
npx playwright test --headed --slow-mo 250
```

### Writing new E2E tests

1. Add files to `tests/e2e/` with extension `.spec.ts`.
2. Use the `page` object to interact with the UI.
3. Keep tests focused and deterministic – prefer `locator` APIs over CSS selectors when possible.

Minimal example:

```ts
import { test, expect } from '@playwright/test'

test('basic navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/IntelliSheet/i)
})
```

---

## 4. Folder structure

```
src/__tests__        ← unit tests (Vitest)
 tests/e2e           ← E2E tests (Playwright)
docs/test            ← test documentation & guides (this folder)
```

---

Happy testing! 🎉