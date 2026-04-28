# Place gs-num-pad and Restructure Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Place the second component (`gs-num-pad`) and restructure docs to match the new repo conventions defined in `docs/superpowers/specs/2026-04-27-gs-components-repo-conventions-design.md`.

**Architecture:** Single npm package, lockstep versioning. Two-tier CSS theming (`--gs-*` shared tokens + component-specific overrides). Per-component README + slim main README as catalog. The new component lives at `src/gs-num-pad/` and is wired through `src/index.js`, `vite.config.js`, `package.json` exports, and `playground/`.

**Tech Stack:** Lit 3, Vite 6, ES modules. No automated test framework — verification is via `npm run build` (build correctness) and `npm run dev` + browser (playground correctness).

---

## File Map

**Created:**
- `src/gs-num-pad/gs-num-pad.js` — LitElement, registers `<gs-num-pad>`. Inline styles (CSS block ~110 lines, under split threshold).
- `src/gs-num-pad/README.md` — standalone API documentation for `<gs-num-pad>`.
- `src/gs-birthday-picker/README.md` — standalone API documentation for `<gs-birthday-picker>` (extracted from main README).
- `playground/gs-num-pad.html` — live demo for the new component.

**Modified:**
- `src/shared/theme.js` — add `--gs-surface`, `--gs-surface-strong`, `--gs-on-accent`, `--gs-danger` tokens.
- `src/index.js` — re-export `GsNumPad`.
- `vite.config.js` — add `gs-num-pad` entry.
- `package.json` — add `./gs-num-pad` subpath export.
- `playground/index.html` — add card for `gs-num-pad`.
- `README.md` — slim down to catalog + shared concerns + new-component checklist; per-component API moves to per-component READMEs.

**Deleted:**
- `files.zip` — temporary delivery archive, no longer needed once num-pad is placed.

---

## Task 1: Expand shared design tokens

**Files:**
- Modify: `src/shared/theme.js`

The new `gs-num-pad` needs surface colors, an accent-foreground color, and a danger color. Add these to the shared tokens so all future components share them too. Defaults are picked to match the existing warm-neutral GsNet palette (`#f0ede8` / `#1a1714` / `#d35322`).

- [ ] **Step 1: Update `src/shared/theme.js`**

Replace the entire file with:

```js
/**
 * GS Components — shared design tokens.
 *
 * Hosts override these CSS custom properties to re-skin every component:
 *
 *   gs-birthday-picker, gs-num-pad {
 *     --gs-bg: #ffffff;
 *     --gs-fg: #1a1714;
 *     --gs-muted: #a09a90;
 *     --gs-accent: #d35322;
 *     --gs-accent-soft: #fef0e8;
 *     --gs-on-accent: #ffffff;
 *     --gs-surface: #f5f3ee;
 *     --gs-surface-strong: #e5e1da;
 *     --gs-danger: #e24b4a;
 *     --gs-border: #e5e1da;
 *     --gs-radius: 16px;
 *     --gs-touch-min: 56px;
 *     --gs-font-family: 'DM Sans', sans-serif;
 *     --gs-font-mono: 'DM Mono', monospace;
 *     --gs-font-serif: 'Instrument Serif', serif;
 *   }
 *
 * Components compose this with their own styles via:
 *
 *   import { gsTokens } from '../shared/theme.js';
 *   static styles = [gsTokens, styles];
 */

import { css } from 'lit';

export const gsTokens = css`
  :host {
    --_bg: var(--gs-bg, #fff);
    --_fg: var(--gs-fg, #1a1714);
    --_muted: var(--gs-muted, #a09a90);
    --_accent: var(--gs-accent, #d35322);
    --_accent-soft: var(--gs-accent-soft, #fef0e8);
    --_on-accent: var(--gs-on-accent, #fff);
    --_surface: var(--gs-surface, #f5f3ee);
    --_surface-strong: var(--gs-surface-strong, #e5e1da);
    --_danger: var(--gs-danger, #e24b4a);
    --_border: var(--gs-border, #e5e1da);
    --_radius: var(--gs-radius, 16px);
    --_touch-min: var(--gs-touch-min, 56px);
    --_font: var(--gs-font-family, 'DM Sans', sans-serif);
    --_font-mono: var(--gs-font-mono, 'DM Mono', monospace);
    --_font-serif: var(--gs-font-serif, 'Instrument Serif', serif);
  }
`;
```

- [ ] **Step 2: Verify build still works**

Run: `npm run build`
Expected: builds successfully, `dist/gs-birthday-picker.js` and `dist/gs-webcomponents.js` produced. (We haven't added the new entry yet — just verifying token additions don't break the existing component.)

- [ ] **Step 3: Commit**

```bash
git add src/shared/theme.js
git commit -m "feat(theme): add surface, on-accent, and danger tokens

Prepares shared design tokens for the second component (gs-num-pad)
which needs neutral surfaces and an accent-foreground color. Defaults
match the existing warm-neutral palette."
```

---

## Task 2: Extract num-pad source from delivery archive

**Files:**
- Read: `files.zip`
- Create: `/tmp/gs-numpad-extract/num-pad.js`, `/tmp/gs-numpad-extract/README.md`
- Create: `src/gs-num-pad/` (directory)

- [ ] **Step 1: Extract files.zip**

Run: `unzip -o files.zip -d /tmp/gs-numpad-extract`
Expected: extracts `num-pad.js` and `README.md` into `/tmp/gs-numpad-extract/`.

- [ ] **Step 2: Create the component directory**

Run: `mkdir -p src/gs-num-pad`

(No commit yet — placeholder directory only.)

---

## Task 3: Place gs-num-pad.js with renamed tag/class

**Files:**
- Create: `src/gs-num-pad/gs-num-pad.js`

The source from the archive uses tag `num-pad` and class `NumPad`. Per conventions, this becomes `gs-num-pad` / `GsNumPad`. Styling will be refactored in Task 4 (kept separate so the rename and theme changes are reviewable independently).

- [ ] **Step 1: Copy source into the component folder**

Run: `cp /tmp/gs-numpad-extract/num-pad.js src/gs-num-pad/gs-num-pad.js`

- [ ] **Step 2: Rename the class**

Edit `src/gs-num-pad/gs-num-pad.js`, replace:

```js
export class NumPad extends LitElement {
```

with:

```js
export class GsNumPad extends LitElement {
```

- [ ] **Step 3: Rename the tag registration**

Edit `src/gs-num-pad/gs-num-pad.js`, replace the bottom of the file:

```js
if (!customElements.get('num-pad')) {
  customElements.define('num-pad', NumPad);
}
```

with:

```js
if (!customElements.get('gs-num-pad')) {
  customElements.define('gs-num-pad', GsNumPad);
}
```

- [ ] **Step 4: Update the file header doc comment**

Edit `src/gs-num-pad/gs-num-pad.js`, replace the top comment block (lines 1–24) with:

```js
/**
 * <gs-num-pad> — touch-first, form-associated numeric keypad.
 *
 * Built with Lit. See README.md for full API.
 *
 * Quick example:
 *
 *   <gs-num-pad
 *     name="amount"
 *     value=""
 *     format="currency"
 *     currency="USD"
 *     decimals="2"
 *     auto-decimal
 *     min="0.01"
 *     max="9999.99"
 *     maxlength="8"
 *     placeholder="$0.00"
 *   ></gs-num-pad>
 *
 *   element.addEventListener('change', (e) => {
 *     console.log(element.value); // canonical "12.34"
 *   });
 */
```

- [ ] **Step 5: Verify the file parses**

Run: `node --check src/gs-num-pad/gs-num-pad.js`
Expected: no output (success).

- [ ] **Step 6: Commit**

```bash
git add src/gs-num-pad/gs-num-pad.js
git commit -m "feat(gs-num-pad): place component with gs- naming

Tag num-pad -> gs-num-pad, class NumPad -> GsNumPad. Source from
delivery archive otherwise unchanged; theme refactor follows in next
commit."
```

---

## Task 4: Refactor gs-num-pad styles to two-tier theming

**Files:**
- Modify: `src/gs-num-pad/gs-num-pad.js`

Make the component compose `gsTokens` and route every color/font CSS variable through the shared token namespace with an opt-out fallback.

- [ ] **Step 1: Add the shared theme import**

Edit `src/gs-num-pad/gs-num-pad.js`, replace:

```js
import { LitElement, html, css, nothing } from 'lit';
```

with:

```js
import { LitElement, html, css, nothing } from 'lit';
import { gsTokens } from '../shared/theme.js';
```

- [ ] **Step 2: Compose tokens into the styles array**

Edit `src/gs-num-pad/gs-num-pad.js`, replace:

```js
  static styles = css`
```

with:

```js
  static styles = [gsTokens, css`
```

The closing backtick of the existing `static styles` block (the line that currently reads `` ` `` immediately before the constructor) needs a matching `]`. Find this block:

```js
    ::slotted([slot='display-prefix']),
    ::slotted([slot='display-suffix']) {
      font-size: 0.65em;
      opacity: 0.7;
    }
  `;
```

Replace with:

```js
    ::slotted([slot='display-prefix']),
    ::slotted([slot='display-suffix']) {
      font-size: 0.65em;
      opacity: 0.7;
    }
  `];
```

- [ ] **Step 3: Refactor color and font CSS variables**

Edit `src/gs-num-pad/gs-num-pad.js`. Replace the entire CSS block inside `static styles` with the version below. Find the block starting with `:host {` and ending at `opacity: 0.7;` (the slotted rule), then replace it with:

```css
    :host {
      display: inline-block;
      font-family: var(--numpad-font, var(--_font));
      background: var(--numpad-bg, var(--_bg));
      border-radius: var(--numpad-radius, 12px);
      padding: var(--numpad-padding, 12px);
      box-sizing: border-box;
      user-select: none;
      -webkit-user-select: none;
    }

    [part='display'] {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 4px;
      background: var(--numpad-display-bg, transparent);
      color: var(--numpad-display-color, var(--_fg));
      font-size: var(--numpad-display-size, 32px);
      font-variant-numeric: tabular-nums;
      font-weight: 500;
      padding: var(--numpad-display-padding, 14px 14px);
      min-height: var(--numpad-display-min-height, 48px);
      border-radius: var(--numpad-key-radius, 8px);
      margin-bottom: var(--numpad-gap, 8px);
      outline: none;
      cursor: text;
      box-sizing: border-box;
    }

    [part='display']:focus {
      box-shadow: 0 0 0 2px var(--numpad-submit-bg, var(--_accent));
    }

    [part='display-value'][data-empty='true']::before {
      content: attr(data-placeholder);
      color: var(--numpad-placeholder-color, var(--_muted));
      opacity: 0.6;
    }

    :host([invalid]) [part='display'] {
      color: var(--numpad-invalid-color, var(--_danger));
    }

    [part='keypad'] {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--numpad-gap, 8px);
    }

    button[part~='key'] {
      font-family: inherit;
      font-size: var(--numpad-key-size, 22px);
      font-weight: 400;
      background: var(--numpad-key-bg, var(--_surface));
      color: var(--numpad-key-color, var(--_fg));
      border: none;
      border-radius: var(--numpad-key-radius, 8px);
      padding: var(--numpad-key-padding, 14px 0);
      height: var(--numpad-key-height, auto);
      box-sizing: border-box;
      cursor: pointer;
      transition: background 0.08s, transform 0.05s;
      -webkit-tap-highlight-color: transparent;
      font-variant-numeric: tabular-nums;
    }

    button[part~='key']:hover {
      background: var(--numpad-key-bg-active, var(--_surface-strong));
    }

    button[part~='key']:active {
      transform: scale(0.97);
    }

    button[part~='key']:disabled {
      opacity: var(--numpad-disabled-opacity, 0.3);
      cursor: default;
    }

    button[part~='key-special'] {
      background: var(--numpad-special-bg, var(--_surface-strong));
      color: var(--numpad-special-color, var(--_fg));
    }

    button[part~='key-submit'] {
      background: var(--numpad-submit-bg, var(--_accent));
      color: var(--numpad-submit-color, var(--_on-accent));
      font-weight: 500;
    }

    button[part~='key-zero'] {
      grid-column: span 2;
    }

    [part='extra-keys'] {
      margin-top: var(--numpad-gap, 8px);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
      gap: var(--numpad-gap, 8px);
    }

    [part='extra-keys']:empty {
      display: none;
    }

    ::slotted([slot='display-prefix']),
    ::slotted([slot='display-suffix']) {
      font-size: 0.65em;
      opacity: 0.7;
    }
```

(Sizing variables — `--numpad-padding`, `--numpad-radius`, `--numpad-display-size`, `--numpad-key-size`, `--numpad-gap`, `--numpad-key-radius`, etc. — stay component-specific. Sizing varies wildly between component types and there's no useful shared default.)

- [ ] **Step 4: Verify the file parses**

Run: `node --check src/gs-num-pad/gs-num-pad.js`
Expected: no output (success).

- [ ] **Step 5: Commit**

```bash
git add src/gs-num-pad/gs-num-pad.js
git commit -m "refactor(gs-num-pad): adopt two-tier theming

Compose gsTokens, route color and font CSS variables through the
shared --gs-* namespace via var(--numpad-*, var(--_token, default))
fallback chains. Sizing variables remain component-specific."
```

---

## Task 5: Place gs-num-pad README

**Files:**
- Create: `src/gs-num-pad/README.md`

Take the README from the delivery archive, swap the tag/class names everywhere, and adapt the install/import sections to reflect the npm package.

- [ ] **Step 1: Copy the delivered README**

Run: `cp /tmp/gs-numpad-extract/README.md src/gs-num-pad/README.md`

- [ ] **Step 2: Replace tag references globally**

The README references the component as `num-pad` in five distinct surface forms. Apply five `replace_all` Edits in order:

1. `replace_all('<num-pad', '<gs-num-pad')` — covers every opening tag (and the H1 `` # `<num-pad>` ``).
2. `replace_all('</num-pad', '</gs-num-pad')` — covers every closing tag.
3. `replace_all('num-pad.', 'gs-num-pad.')` — covers `num-pad.js`, `num-pad.compact`, `num-pad.comfortable`, `num-pad.tablet` (sizing preset selectors).
4. `replace_all('num-pad:', 'gs-num-pad:')` — covers the `num-pad::part(...)` CSS selector list.
5. `replace_all("'num-pad'", "'gs-num-pad'")` — covers the `customElements.get('num-pad')` reference in the install section.

The `numpad-` CSS variable prefix is **intentional** (component-specific tier namespace) — do not touch it. The class name `NumPad` does not appear in this README, so no class rename pass is needed.

Run: `grep -n 'num-pad' src/gs-num-pad/README.md | grep -v 'numpad-' | grep -v 'gs-num-pad'`
Expected: empty output (every `num-pad` reference is now either `gs-num-pad` or the `numpad-` CSS variable prefix).

- [ ] **Step 3: Update the Install section**

Edit `src/gs-num-pad/README.md`, replace the entire `## Install` section (from `## Install` through the line ending with `is safe.`) with:

```markdown
## Install

```bash
npm install gs-webcomponents lit
```

`lit` is a peer dependency. Import the component once in your app entry:

```js
import 'gs-webcomponents/gs-num-pad';
```

After import, `<gs-num-pad>` is registered globally and can be used anywhere in your HTML. The component re-checks `customElements.get('gs-num-pad')` before defining, so importing it twice from different bundles is safe.
```

- [ ] **Step 4: Update the esbuild bundling section**

Edit `src/gs-num-pad/README.md`, replace the `#### Bundling with esbuild` subsection (from `#### Bundling with esbuild` through the line ending with `from `node_modules/lit`.`) with:

```markdown
#### Bundling with esbuild

Phoenix's default `assets/` setup uses esbuild. Add the package:

```bash
cd assets
npm install gs-webcomponents lit
```

Import the component from `assets/js/app.js`:

```js
import "gs-webcomponents/gs-num-pad";
```

esbuild resolves `import { LitElement } from 'lit'` from `node_modules/lit`.
```

- [ ] **Step 5: Update the React example import**

Edit `src/gs-num-pad/README.md`, replace:

```jsx
import 'num-pad.js';
```

with:

```jsx
import 'gs-webcomponents/gs-num-pad';
```

- [ ] **Step 6: Add a Theming note pointing to shared tokens**

Edit `src/gs-num-pad/README.md`. Find the `## Styling` heading. Insert this paragraph immediately after the `## Styling` line and before `The component exposes a **CSS Custom Properties first** API.`:

```markdown
The component participates in the shared `gs-components` theme system. Color CSS variables fall back through the shared `--gs-*` namespace, so setting `--gs-accent` or `--gs-surface` once on a host (or higher) re-skins this component along with every other gs-component. Use the component-specific `--numpad-*` variables only when you need to diverge from the shared theme.

```

- [ ] **Step 7: Commit**

```bash
git add src/gs-num-pad/README.md
git commit -m "docs(gs-num-pad): add per-component README

Adapted from the delivered standalone README — tag and class renamed,
install/import paths point to the npm package, and a theming note
links into the shared --gs-* token system."
```

---

## Task 6: Wire gs-num-pad into build and exports

**Files:**
- Modify: `src/index.js`
- Modify: `vite.config.js`
- Modify: `package.json`

- [ ] **Step 1: Re-export from the main bundle entry**

Edit `src/index.js`, replace the entire file with:

```js
export { GsBirthdayPicker } from './gs-birthday-picker/gs-birthday-picker.js';
export { GsNumPad } from './gs-num-pad/gs-num-pad.js';
```

- [ ] **Step 2: Add the Vite entry**

Edit `vite.config.js`, replace the `entry` block:

```js
      entry: {
        'gs-webcomponents': 'src/index.js',
        'gs-birthday-picker': 'src/gs-birthday-picker/gs-birthday-picker.js',
      },
```

with:

```js
      entry: {
        'gs-webcomponents': 'src/index.js',
        'gs-birthday-picker': 'src/gs-birthday-picker/gs-birthday-picker.js',
        'gs-num-pad': 'src/gs-num-pad/gs-num-pad.js',
      },
```

- [ ] **Step 3: Add the package.json subpath export**

Edit `package.json`, replace the `exports` block:

```json
  "exports": {
    ".": "./dist/gs-webcomponents.js",
    "./gs-birthday-picker": "./dist/gs-birthday-picker.js"
  },
```

with:

```json
  "exports": {
    ".": "./dist/gs-webcomponents.js",
    "./gs-birthday-picker": "./dist/gs-birthday-picker.js",
    "./gs-num-pad": "./dist/gs-num-pad.js"
  },
```

- [ ] **Step 4: Add `gs-num-pad` to the keywords list (optional but matches existing pattern)**

Edit `package.json`, replace:

```json
  "keywords": [
    "web-components",
    "custom-elements",
    "lit",
    "birthday-picker",
    "date-picker",
    "gsnet"
  ],
```

with:

```json
  "keywords": [
    "web-components",
    "custom-elements",
    "lit",
    "birthday-picker",
    "date-picker",
    "num-pad",
    "numeric-keypad",
    "gsnet"
  ],
```

- [ ] **Step 5: Build and verify all three outputs**

Run: `npm run build`
Expected: build succeeds and `dist/` now contains:
- `dist/gs-webcomponents.js`
- `dist/gs-birthday-picker.js`
- `dist/gs-num-pad.js`

Verify with: `ls -1 dist/`
Expected: the three files above.

- [ ] **Step 6: Commit**

```bash
git add src/index.js vite.config.js package.json
git commit -m "build(gs-num-pad): wire into multi-entry build

Adds gs-num-pad to src/index.js re-exports, vite.config.js entry, and
package.json exports/keywords."
```

---

## Task 7: Create the gs-num-pad playground

**Files:**
- Create: `playground/gs-num-pad.html`

Mirror the structure of `playground/gs-birthday-picker.html`: header with back link, demo container, options panel, result display, dark-theme toggle. The result display shows the latest `numpad-input` event detail.

- [ ] **Step 1: Write the playground file**

Create `playground/gs-num-pad.html` with:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>gs-num-pad — Playground</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f0ede8;
    font-family: 'DM Sans', sans-serif;
    padding: 24px;
    gap: 24px;
  }

  .demo-header {
    width: 80vw;
    max-width: 480px;
  }
  .demo-header a {
    font-size: 14px;
    color: #7a746b;
    text-decoration: none;
  }
  .demo-header a:hover { text-decoration: underline; }
  .demo-header h2 {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(28px, 4vw, 48px);
    color: #1a1714;
    margin: 8px 0;
    font-weight: 400;
  }
  .demo-header p {
    color: #7a746b;
    font-size: clamp(14px, 2vw, 20px);
  }

  .demo-component {
    width: 80vw;
    max-width: 380px;
  }

  /* Options panel */
  .options-panel {
    width: 80vw;
    max-width: 480px;
    background: #fff;
    border-radius: 16px;
    padding: 20px 28px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }
  .options-panel h3 {
    font-size: 13px;
    font-weight: 600;
    color: #a09a90;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 16px;
  }
  .option-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid #e5e1da;
  }
  .option-row:last-child { border-bottom: none; }
  .option-row label {
    font-size: 15px;
    color: #1a1714;
    flex: 1;
    font-weight: 500;
  }
  .option-row input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: #d35322;
  }
  .option-row select {
    font-family: inherit;
    font-size: 14px;
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid #e5e1da;
  }
  .option-row code {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: #7a746b;
    background: #f5f3ee;
    padding: 2px 8px;
    border-radius: 4px;
  }

  /* Result */
  .result-display {
    width: 80vw;
    max-width: 480px;
    padding: 20px 24px;
    background: #1a1714;
    border-radius: 16px;
    color: #f0ede8;
    font-family: 'DM Mono', monospace;
    font-size: clamp(13px, 2vw, 16px);
    display: none;
    word-break: break-all;
  }
  .result-display.visible { display: block; }

  /* Theme preview */
  .theme-dark {
    --gs-bg: #1a1714;
    --gs-fg: #f0ede8;
    --gs-muted: #6b6560;
    --gs-accent: #e8824a;
    --gs-on-accent: #1a1714;
    --gs-surface: #2a2220;
    --gs-surface-strong: #3a3530;
    --gs-border: #3a3530;
  }
</style>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Instrument+Serif&display=swap" rel="stylesheet">
</head>
<body>

<div class="demo-header">
  <a href="./index.html">&larr; All components</a>
  <h2>&lt;gs-num-pad&gt;</h2>
  <p>Touch-first, form-associated numeric keypad</p>
</div>

<div class="demo-component">
  <gs-num-pad
    id="pad"
    name="amount"
    format="currency"
    currency="USD"
    decimals="2"
    auto-decimal
    min="0.01"
    max="9999.99"
    maxlength="8"
    placeholder="$0.00"
  ></gs-num-pad>
</div>

<div class="options-panel">
  <h3>Options</h3>
  <div class="option-row">
    <label for="opt-format">Format</label>
    <code>format</code>
    <select id="opt-format">
      <option value="currency" selected>currency (USD)</option>
      <option value="currency-krw">currency (KRW)</option>
      <option value="plain">plain</option>
      <option value="percent">percent</option>
    </select>
  </div>
  <div class="option-row">
    <label for="opt-double-zero">Double zero key</label>
    <code>double-zero</code>
    <input type="checkbox" id="opt-double-zero">
  </div>
  <div class="option-row">
    <label for="opt-allow-negative">Allow negative</label>
    <code>allow-negative</code>
    <input type="checkbox" id="opt-allow-negative">
  </div>
  <div class="option-row">
    <label for="opt-disabled">Disabled</label>
    <code>disabled</code>
    <input type="checkbox" id="opt-disabled">
  </div>
  <div class="option-row">
    <label for="opt-dark">Dark theme</label>
    <code>--gs-*</code>
    <input type="checkbox" id="opt-dark">
  </div>
</div>

<div class="result-display" id="result"></div>

<script type="module">
import '../src/gs-num-pad/gs-num-pad.js';

const pad = document.getElementById('pad');
const result = document.getElementById('result');

// Format toggle (presets a sensible config combo)
document.getElementById('opt-format').addEventListener('change', (e) => {
  const v = e.target.value;
  if (v === 'currency') {
    pad.format = 'currency';
    pad.currency = 'USD';
    pad.decimals = 2;
    pad.autoDecimal = true;
    pad.placeholder = '$0.00';
    pad.locale = '';
  } else if (v === 'currency-krw') {
    pad.format = 'currency';
    pad.currency = 'KRW';
    pad.decimals = 0;
    pad.autoDecimal = false;
    pad.placeholder = '₩0';
    pad.locale = 'ko-KR';
  } else if (v === 'plain') {
    pad.format = 'plain';
    pad.currency = '';
    pad.decimals = 0;
    pad.autoDecimal = false;
    pad.placeholder = '0';
    pad.locale = '';
  } else if (v === 'percent') {
    pad.format = 'percent';
    pad.currency = '';
    pad.decimals = 2;
    pad.autoDecimal = true;
    pad.placeholder = '0.00%';
    pad.locale = '';
  }
  pad.value = '';
});

document.getElementById('opt-double-zero').addEventListener('change', (e) => {
  pad.doubleZero = e.target.checked;
});
document.getElementById('opt-allow-negative').addEventListener('change', (e) => {
  pad.allowNegative = e.target.checked;
});
document.getElementById('opt-disabled').addEventListener('change', (e) => {
  pad.disabled = e.target.checked;
});

// Dark theme toggle (set on body so the demo and options recolor together)
document.getElementById('opt-dark').addEventListener('change', (e) => {
  pad.classList.toggle('theme-dark', e.target.checked);
});

// Event listeners
pad.addEventListener('numpad-input', (e) => {
  result.classList.add('visible');
  result.textContent = `numpad-input → value: "${e.detail.value}"  formatted: "${e.detail.formattedValue}"  key: ${e.detail.key}`;
});

pad.addEventListener('change', (e) => {
  console.log('change', pad.value);
});
</script>

</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add playground/gs-num-pad.html
git commit -m "demo(gs-num-pad): add playground page

Mirrors the gs-birthday-picker playground shape — header with back
link, demo, options panel (format presets, feature toggles, dark
theme), and result display showing numpad-input details."
```

---

## Task 8: Add gs-num-pad to the playground catalog

**Files:**
- Modify: `playground/index.html`

- [ ] **Step 1: Add the catalog card**

Edit `playground/index.html`, replace:

```html
<div class="component-list">
  <a class="component-card" href="./gs-birthday-picker.html">
    <div>
      <h3>&lt;gs-birthday-picker&gt;</h3>
      <p>Birthday date input with decade swipe, month grid, calendar</p>
    </div>
    <span class="arrow">→</span>
  </a>
</div>
```

with:

```html
<div class="component-list">
  <a class="component-card" href="./gs-birthday-picker.html">
    <div>
      <h3>&lt;gs-birthday-picker&gt;</h3>
      <p>Birthday date input with decade swipe, month grid, calendar</p>
    </div>
    <span class="arrow">→</span>
  </a>
  <a class="component-card" href="./gs-num-pad.html">
    <div>
      <h3>&lt;gs-num-pad&gt;</h3>
      <p>Touch-first, form-associated numeric keypad</p>
    </div>
    <span class="arrow">→</span>
  </a>
</div>
```

- [ ] **Step 2: Verify the playground end-to-end (manual)**

Run: `npm run dev` (in a separate terminal — runs Vite dev server)
Open: `http://localhost:5173/playground/index.html` in a browser
Verify:
- Catalog page lists both `<gs-birthday-picker>` and `<gs-num-pad>` cards.
- Click `<gs-num-pad>` → opens the playground.
- The pad renders, keypress shows formatted value in display, `numpad-input` event details appear in the result bar.
- Toggling Dark theme recolors keys and submit button (proves shared tokens are wired).
- Switching Format preset to KRW shows `₩` symbol and integer behavior.
- Going back to catalog and clicking `<gs-birthday-picker>` still works (no regression).

Stop the dev server when done (Ctrl-C).

If anything fails, debug before proceeding. Otherwise commit.

- [ ] **Step 3: Commit**

```bash
git add playground/index.html
git commit -m "demo: add gs-num-pad to playground catalog"
```

---

## Task 9: Extract gs-birthday-picker README from main README

**Files:**
- Create: `src/gs-birthday-picker/README.md`

The main README currently contains all gs-birthday-picker API documentation inline. Per the new convention, that lives in `src/gs-birthday-picker/README.md` and the main README links to it. The follow-up task slims the main README.

- [ ] **Step 1: Write the per-component README**

Create `src/gs-birthday-picker/README.md` with:

```markdown
# `<gs-birthday-picker>`

Touch-optimized birthday date input. Three-step picker: pick a decade, a year, a month, and a day. Decades swipe horizontally on touch devices; months expand into a 3×4 grid; days render as a month calendar.

```html
<gs-birthday-picker show-age></gs-birthday-picker>

<script type="module">
  const el = document.querySelector('gs-birthday-picker');
  el.addEventListener('gs-birthday-selected', (e) => {
    console.log(e.detail); // { year, month, day, date, iso, age }
  });
</script>
```

---

## Install

```bash
npm install gs-webcomponents lit
```

Import the component once in your app entry:

```js
import 'gs-webcomponents/gs-birthday-picker';
```

After import, `<gs-birthday-picker>` is registered globally and can be used anywhere in your HTML.

---

## Sizing

The component is **box-agnostic**: `:host` sets `display: block` with no intrinsic height or viewport coupling. The consumer decides the size by wrapping the tag (or constraining it directly). Internally, the component uses `container-type: size` so shadow DOM layout adapts to the _host's actual box_, not the outer viewport — the compact landscape-phone layout activates whenever the host is ≤480px tall and ≥700px wide, regardless of where the component is embedded.

Recommended patterns:

```html
<!-- Full-page signing flow (Tailwind) -->
<div class="h-[calc(100svh-14rem)] min-h-[28rem]">
  <gs-birthday-picker></gs-birthday-picker>
</div>

<!-- Modal / fixed card -->
<div style="height: 520px;">
  <gs-birthday-picker></gs-birthday-picker>
</div>

<!-- Inline, natural size (no wrapper) -->
<gs-birthday-picker></gs-birthday-picker>
```

When a definite height is given, internal panels flex-fill that box and the year grid uses `1fr` rows. When no height is given, the component renders at its natural content height. Panels reserve 5rem of bottom padding for the absolutely-positioned result bar, so selecting a date does not cause layout shift.

Container-query breakpoints (evaluated on the host's own box, not the viewport):

| Host size | Layout |
| --- | --- |
| Default (tall / portrait) | Year step stacked vertically; 5-col year grid (2-col in portrait viewports). |
| `max-height: 480px and min-width: 700px` (e.g. landscape phone) | Year step reshapes into 2-col: decade nav + hint + dots on the left, year grid on the right. Month grid compresses to 4×3. |

---

## Attributes / properties

| Attribute | Property | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `show-age` | `showAge` | boolean | `true` | Show computed age in the result bar. |
| `min-year` | `minYear` | number | `1930` | Earliest selectable year. |
| `max-year` | `maxYear` | number | current year | Latest selectable year; future years are disabled. |
| `default-decade` | `defaultDecade` | number | current year − 30, floored to decade | Decade shown on first open. |
| `value` | `value` | string | `''` | ISO `YYYY-MM-DD`; reflected to attribute. Set to prefill. |

---

## Events

| Event | Detail |
| --- | --- |
| `gs-birthday-changed` | `{ year, month, day }` — fired on any selection change (partial or complete). |
| `gs-birthday-selected` | `{ year, month, day, date, iso, age }` — fired once all three fields are set. |

Both events bubble and cross shadow DOM boundaries.

---

## Styling

The component participates in the shared `gs-components` theme system. Override the `--gs-*` tokens on (or inside) the element to re-skin:

```css
gs-birthday-picker {
  --gs-bg: #ffffff;
  --gs-fg: #1a1714;
  --gs-muted: #a09a90;
  --gs-accent: #d35322;
  --gs-accent-soft: #fef0e8;
  --gs-border: #e5e1da;
  --gs-radius: 16px;
  --gs-touch-min: 56px;
  --gs-font-family: 'DM Sans', sans-serif;
  --gs-font-mono: 'DM Mono', monospace;
  --gs-font-serif: 'Instrument Serif', serif;
}
```

All tokens have sensible fallbacks (see `src/shared/theme.js`), so you only need to set what you want to change.

---

## Phoenix LiveView

See the main [README.md](../../README.md#phoenix-liveview) for the generic LiveView integration pattern (hook wiring, colocated hooks, `phx-update="ignore"` rationale). The component dispatches `gs-birthday-selected` and `gs-birthday-changed`; map those to LiveView events via the hook.
```

- [ ] **Step 2: Commit**

```bash
git add src/gs-birthday-picker/README.md
git commit -m "docs(gs-birthday-picker): add per-component README

Extracts the gs-birthday-picker API documentation from the main
README into the component folder, matching the convention followed by
gs-num-pad."
```

---

## Task 10: Slim the main README

**Files:**
- Modify: `README.md`

Replace the main README with a catalog + shared concerns + new-component checklist. Per-component API detail moves to per-component READMEs (already created).

- [ ] **Step 1: Replace the file content**

Overwrite `README.md` with:

```markdown
# gs-components

Web components for GsNet — touch-first, themeable, built with [Lit](https://lit.dev).

Each component ships as a standalone ES module that defines its own custom element, so you can import just what you need. Styling is driven by CSS custom properties (`--gs-*`) so host apps can theme components without forking them.

## Components

| Tag | Description | Docs |
| --- | --- | --- |
| `<gs-birthday-picker>` | Birthday date input with decade swipe, month grid, calendar. | [src/gs-birthday-picker/](./src/gs-birthday-picker/README.md) |
| `<gs-num-pad>` | Touch-first, form-associated numeric keypad. | [src/gs-num-pad/](./src/gs-num-pad/README.md) |

## Install

```bash
npm install gs-webcomponents lit
```

`lit` is declared as a **peer dependency** and marked `external` in the build, so the host app must install it alongside. This also prevents duplicate Lit copies (which would break the custom-element registry).

## Usage

Import the full bundle:

```js
import 'gs-webcomponents';
```

…or a single component:

```js
import 'gs-webcomponents/gs-birthday-picker';
import 'gs-webcomponents/gs-num-pad';
```

After import, the custom element is registered globally and can be used anywhere:

```html
<gs-birthday-picker show-age></gs-birthday-picker>
<gs-num-pad name="amount" format="currency" currency="USD" decimals="2" auto-decimal></gs-num-pad>
```

See each component's README (linked in the table above) for its full API.

## Theming

Every component composes a shared design-token sheet (`src/shared/theme.js`) and routes its own color and font CSS variables through that namespace. This gives hosts two layers of control:

```css
/* Tier 1 — re-skin everything by setting shared tokens */
:root {
  --gs-bg: #ffffff;
  --gs-fg: #1a1714;
  --gs-accent: #d35322;
  --gs-accent-soft: #fef0e8;
  --gs-on-accent: #ffffff;
  --gs-surface: #f5f3ee;
  --gs-surface-strong: #e5e1da;
  --gs-muted: #a09a90;
  --gs-border: #e5e1da;
  --gs-danger: #e24b4a;
  --gs-radius: 16px;
  --gs-font-family: 'DM Sans', sans-serif;
}

/* Tier 2 — diverge on a single component */
gs-num-pad {
  --numpad-key-bg: #fff;
  --numpad-submit-bg: #185fa5;
}
```

The shared tokens have sensible fallbacks, so you only set what you want to change. Component-specific variables (e.g. `--numpad-*`, sizing tokens) are documented in the per-component README.

## Phoenix LiveView

Custom elements are plain `HTMLElement`s, so Phoenix hooks attach directly — no wrapper `<div>` needed. Add `phx-update="ignore"` so LiveView's DOM diff does not patch over the component's internal state on re-render.

Two wiring styles below — pick based on your Phoenix/LiveView version.

### Classic hooks (any LiveView version)

Template:

```heex
<gs-birthday-picker
  id="birthday-picker"
  phx-hook="GsBirthdayPicker"
  phx-update="ignore"
  value={@birthday}
  show-age
/>
```

Hook file — import the component once, forward the component's custom event to the server:

```js
// assets/js/hooks/gs_birthday_picker.js
import "gs-webcomponents/gs-birthday-picker";

export const GsBirthdayPicker = {
  mounted() {
    this.el.addEventListener("gs-birthday-selected", ({ detail }) => {
      this.pushEvent("birthday-selected", {
        iso: detail.iso,
        age: detail.age,
      });
    });
  },
};
```

Register in `app.js`:

```js
import { GsBirthdayPicker } from "./hooks/gs_birthday_picker";

let liveSocket = new LiveSocket("/live", Socket, {
  hooks: { GsBirthdayPicker },
  // ...
});
```

### Colocated hooks (LiveView 1.1+ · Phoenix 1.8+)

Wrap the custom element in a function component and colocate the hook in the same file. Hook names starting with `.` are prefixed with the enclosing module at compile time.

```elixir
defmodule MyAppWeb.Components.BirthdayPicker do
  use Phoenix.Component
  alias Phoenix.LiveView.ColocatedHook

  attr :id, :string, required: true
  attr :value, :string, default: ""
  attr :show_age, :boolean, default: true

  def birthday_picker(assigns) do
    ~H"""
    <gs-birthday-picker
      id={@id}
      phx-hook=".BirthdayPicker"
      phx-update="ignore"
      value={@value}
      show-age={@show_age}
    />
    <script :type={ColocatedHook} name=".BirthdayPicker">
      import "gs-webcomponents/gs-birthday-picker";

      export default {
        mounted() {
          this.el.addEventListener("gs-birthday-selected", ({ detail }) => {
            this.pushEvent("birthday-selected", {
              iso: detail.iso,
              age: detail.age,
            });
          });
        },
      };
    </script>
    """
  end
end
```

Import all colocated hooks once in `app.js` (replace `my_app` with the OTP app name from `mix.exs`):

```js
import { hooks as colocatedHooks } from "phoenix-colocated/my_app";

let liveSocket = new LiveSocket("/live", Socket, {
  hooks: { ...colocatedHooks },
  // ...
});
```

Colocated hooks require an esbuild config update so the `phoenix-colocated` folder in `_build/$MIX_ENV` is resolvable — see the `Phoenix.LiveView.ColocatedHook` module docs.

### Why `phx-update="ignore"`?

The components are reactive and reflect attribute changes immediately. Without `phx-update="ignore"`, a server-side re-render mid-input would clobber the user's in-progress value. To force a value update from the server after mount, change the element's `id` (forces remount) or push an event through the hook that writes `this.el.value = newValue`.

`gs-num-pad` is **form-associated**, so for plain `phx-change` / `phx-submit` flows you don't need a hook at all — its value participates in `FormData` natively. See the gs-num-pad README for details.

## Development

```bash
npm install
npm run dev        # Vite dev server with the playground
npm run build      # Build ES modules to dist/
npm run preview    # Preview the built output
```

- `playground/index.html` — index of all components
- `playground/<component>.html` — live demo wired to the source in `src/`

Source of truth for component code lives in `src/`; `dist/` is generated and git-ignored.

## Adding a new component

1. Create `src/gs-<name>/gs-<name>.js` — class extends `LitElement`, registers `gs-<name>`, composes `gsTokens` from `../shared/theme.js`.
2. Create `src/gs-<name>/README.md` — follow the standard sections: overview, install, attributes/properties, events, slots (if any), styling, examples.
3. Add `export { Gs<Name> } from './gs-<name>/gs-<name>.js';` to `src/index.js`.
4. Add `'gs-<name>': 'src/gs-<name>/gs-<name>.js'` to `vite.config.js` `build.lib.entry`.
5. Add `"./gs-<name>": "./dist/gs-<name>.js"` to `package.json` `exports`.
6. Create `playground/gs-<name>.html` — mirror the structure of an existing playground page.
7. Add a card to `playground/index.html`.
8. Add a row to the **Components** table in this README, linking to the per-component README.

When component-specific colors are needed, add the corresponding shared token to `src/shared/theme.js` first, then have the component reference it via `var(--<name>-foo, var(--_token, default))`. Don't hardcode colors — go through the two-tier theming chain.

## Project layout

```
src/
  index.js                          # bundle entry — re-exports every component
  shared/
    theme.js                        # shared --gs-* design tokens
  gs-birthday-picker/
    gs-birthday-picker.js
    styles.js
    README.md
  gs-num-pad/
    gs-num-pad.js
    README.md
playground/                         # manual test harnesses
docs/superpowers/                   # design specs and implementation plans
vite.config.js                      # multi-entry library build
```

## License

[MIT](./LICENSE)
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README as catalog + shared concerns

Per-component API detail now lives in src/gs-<name>/README.md. Main
README is the catalog, install/theming/LiveView guide, new-component
checklist, and project layout."
```

---

## Task 11: Final end-to-end verification

**Files:** none modified.

- [ ] **Step 1: Clean build verification**

Run: `rm -rf dist && npm run build`
Expected: build succeeds. Verify `dist/` contains exactly:
- `gs-webcomponents.js`
- `gs-birthday-picker.js`
- `gs-num-pad.js`

Run: `ls -1 dist/`
Expected: the three files above (no extras).

- [ ] **Step 2: Verify package exports resolve**

Run: `node -e "import('./dist/gs-num-pad.js').then(m => console.log(Object.keys(m)))"`
Expected: prints `[ 'GsNumPad' ]`.

Run: `node -e "import('./dist/gs-birthday-picker.js').then(m => console.log(Object.keys(m)))"`
Expected: prints `[ 'GsBirthdayPicker' ]`.

Run: `node -e "import('./dist/gs-webcomponents.js').then(m => console.log(Object.keys(m).sort()))"`
Expected: prints `[ 'GsBirthdayPicker', 'GsNumPad' ]`.

- [ ] **Step 3: Verify both playgrounds (manual)**

Run: `npm run dev`
Open: `http://localhost:5173/playground/index.html`

Verify in this order:
1. Catalog shows two cards (gs-birthday-picker, gs-num-pad).
2. Click `<gs-birthday-picker>` — it renders, decade swipe / year / month / day flow works, result bar shows ISO + age.
3. Back to catalog. Click `<gs-num-pad>` — keypad renders, currency formatting on display works (e.g. tap `1 2 3 4` → shows `$12.34`), `numpad-input` event details appear in result bar.
4. Toggle Dark theme on gs-num-pad — keys, special keys, submit button all recolor (proves shared `--gs-*` tokens flow through).
5. Switch Format preset to KRW — display shows `₩` symbol, integer behavior; switch back to USD — `$` returns.

Stop the dev server (Ctrl-C).

If any check fails, debug before proceeding.

- [ ] **Step 4: Verify README links work**

Run: `grep -E '\[.*\]\(.*\)' README.md | grep -v 'http' | head`
Expected: relative links to `./src/gs-birthday-picker/README.md`, `./src/gs-num-pad/README.md`, `./LICENSE` — confirm each target exists with `ls`:
- `ls src/gs-birthday-picker/README.md src/gs-num-pad/README.md LICENSE`
- All three should print without error.

---

## Task 12: Clean up the delivery archive

**Files:**
- Delete: `files.zip`

The archive was a one-shot delivery vehicle and is now redundant — its contents live in `src/gs-num-pad/`.

- [ ] **Step 1: Confirm with the user before deleting**

The `files.zip` is currently untracked. Ask the user: "OK to delete `files.zip` now that gs-num-pad is placed?" — wait for confirmation.

- [ ] **Step 2: If approved, remove it**

Run: `rm files.zip`

- [ ] **Step 3: Also clean the temp extraction**

Run: `rm -rf /tmp/gs-numpad-extract`

(No commit — these were untracked / temporary files.)

---

## Done state

After all tasks complete:
- `src/gs-num-pad/` exists with `gs-num-pad.js` + `README.md`
- `src/gs-birthday-picker/README.md` exists
- `src/shared/theme.js` exposes the new shared tokens
- `src/index.js`, `vite.config.js`, `package.json` all wire `gs-num-pad`
- `playground/gs-num-pad.html` works end-to-end and `playground/index.html` lists both components
- `README.md` is a catalog with per-component links and the new-component checklist
- `dist/` builds cleanly with all three artifacts
- `files.zip` is removed (subject to user confirmation)
- 8 commits land on the branch in semantic order: theme expansion → component placement → component refactor → component README → build wiring → playground → catalog update → birthday-picker README extraction → main README rewrite
