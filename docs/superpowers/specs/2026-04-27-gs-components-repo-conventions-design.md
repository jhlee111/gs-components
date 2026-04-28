# gs-components Repo Conventions

**Date:** 2026-04-27
**Status:** Approved
**Scope:** Set repository conventions for gs-webcomponents to absorb the second component (`gs-num-pad`) and scale to ~5–8 components without rework.

## Context

The repo currently ships one component (`gs-birthday-picker`) as a single npm package built with Vite. A second component (`num-pad`) is being added, and more are expected. Before placing the new component, we want to lock in conventions covering directory layout, naming, theming, documentation, build wiring, and the playground — so adding components 3 through 8 is mechanical, not a design exercise each time.

**Out of scope for this design:** automated tests, monorepo split, per-component versioning, CI/release automation. These can be revisited if the project grows past ~8 components.

## Decisions

### 1. Single npm package, lockstep versioning

One package (`gs-webcomponents`), one `package.json`, one version. Components are imported individually via subpath exports, but they release together.

**Why:** Scale expectation is 5–8 internal components for GsNet. A monorepo or per-component packaging would add tooling cost without payoff at this size.

### 2. Directory layout

```
src/
  index.js                          # re-exports every component (main bundle entry)
  shared/
    theme.js                        # --gs-* shared design tokens (CSS)
    (utils.js)                      # future shared helpers — add only when needed
  gs-<name>/
    gs-<name>.js                    # LitElement + customElements.define
    styles.js                       # OPTIONAL — split when component CSS exceeds ~200 lines
    README.md                       # the component's standalone API documentation
playground/
  index.html                        # catalog of all components (cards)
  gs-<name>.html                    # per-component live demo, imports from src directly
dist/                               # build output (git-ignored)
docs/superpowers/specs/             # design specs (this file lives here)
```

**Naming:**
- Custom element tag: `gs-<kebab-name>` (e.g. `gs-num-pad`, `gs-birthday-picker`)
- Class name: `Gs<PascalName>` (e.g. `GsNumPad`, `GsBirthdayPicker`)
- Folder name: matches the tag

**Style file split rule:** keep styles inline in the component file by default. Split into `styles.js` only when the CSS block exceeds ~200 lines. Rationale: avoids ceremony for small components; keeps large components navigable.

### 3. Two-tier theming

`src/shared/theme.js` owns the cross-component design tokens under the `--gs-*` namespace (background, foreground, accent, surface, border, radius, font families, etc.). Every component composes it:

```js
import { gsTokens } from '../shared/theme.js';
import { styles } from './styles.js';
static styles = [gsTokens, styles];
```

Component-specific CSS variables exist for fine-grained overrides but **always fall back to a shared token first**, then a hard-coded default:

```css
background: var(--numpad-key-bg, var(--gs-surface, #f0f0f0));
color:      var(--numpad-key-color, var(--gs-fg, #111));
```

**Why:** the host can re-skin everything by setting `--gs-accent` once, and still reach in with `--numpad-key-bg` when a single piece needs to diverge. This is the pattern used by Shoelace and Material Web Components.

**Required additions to `shared/theme.js` to support this:** `--gs-surface`, `--gs-surface-strong`, `--gs-on-accent` (or equivalent). Audit the new component's color palette against the shared tokens during placement and surface any token gaps to the user.

### 4. Documentation strategy

- **Main README** is the catalog and the home for shared concerns:
  - Install, usage (full vs single-component import)
  - Theming principles (the two-tier model)
  - LiveView integration patterns (generic — applies to all components)
  - Development workflow
  - A Components table with one row per component, linking to the per-component README on GitHub
  - The "adding a new component" checklist (see §6)
- **Per-component README** lives at `src/gs-<name>/README.md` and contains the full API: overview, quick start, attributes, properties, methods, events, slots, styling, examples, limitations.
- Per-component READMEs follow a consistent section order so readers know where to look.

**Why:** num-pad's README is already 600 lines on its own; merging into a single README would be unmanageable. Keeping the README next to the source means the documentation moves with the code.

### 5. Build and package wiring

- `vite.config.js`: each component is a named entry under `build.lib.entry`. Lit is external.
- `package.json` `exports`:
  - `"."` → main bundle (re-exports all)
  - `"./gs-<name>"` → per-component entry
- `package.json` `files`: `["dist", "src"]` (already set). Per-component READMEs ship inside `src/`, so consumers reading the npm tarball can find component docs locally.

### 6. Adding a new component — checklist

This list lives in the main README so future contributors (or future-me) follow the same path:

1. Create `src/gs-<name>/gs-<name>.js` — class extends `LitElement`, registers `gs-<name>`.
2. Create `src/gs-<name>/README.md` — follow the standard section order.
3. Add re-export to `src/index.js`.
4. Add entry to `vite.config.js` under `build.lib.entry`.
5. Add subpath export to `package.json` `exports`.
6. Create `playground/gs-<name>.html` — live demo with options panel and result display.
7. Add a card to `playground/index.html`.
8. Add a row to the Components table in the main README, linking to the per-component README.

### 7. Playground conventions

- `playground/index.html` is a static catalog of cards; one per component.
- `playground/gs-<name>.html` follows the existing `gs-birthday-picker.html` shape: header (with back link), demo container, options panel, result display, dark-theme toggle. Imports the component from `../src/...` so it always reflects working-tree source.

## Application to current state

After this design is approved, an implementation plan will:

1. Audit `src/shared/theme.js` and add any missing tokens (`--gs-surface`, etc.) needed to support `num-pad` at the shared-token tier.
2. Place num-pad as `gs-num-pad`:
   - Move `num-pad.js` → `src/gs-num-pad/gs-num-pad.js`, rename class `NumPad` → `GsNumPad`, change tag, refactor color CSS variables to two-tier (`var(--numpad-*, var(--gs-*, default))`), keep styles inline (CSS block is ~110 lines, under threshold).
   - Place README at `src/gs-num-pad/README.md`, updated for new tag/class names.
   - Wire into `src/index.js`, `vite.config.js`, `package.json` exports.
   - Create `playground/gs-num-pad.html`.
3. Update `playground/index.html` to add the gs-num-pad card.
4. Verify `gs-birthday-picker` already follows the conventions (it does — confirm folder layout, README move from main README to `src/gs-birthday-picker/README.md`).
5. Rewrite main README as catalog + shared concerns + new-component checklist; move per-component API detail into the respective per-component READMEs.

## Open questions / non-decisions

- **Tests:** none currently; not adding in this round. Worth revisiting after component #4.
- **Shared utilities (`src/shared/utils.js`):** create only when the second consumer appears. Don't pre-build infrastructure.
- **TypeScript / `.d.ts`:** not in scope; current consumers (LiveView, vanilla) don't need it.
