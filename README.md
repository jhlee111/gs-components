# gs-components

Web components for GsNet — touch-first, themeable, built with [Lit](https://lit.dev).

Each component ships as a standalone ES module that defines its own custom element, so you can import just what you need. Styling is driven by CSS custom properties (`--gs-*`) so host apps can theme components without forking them.

## Components

| Tag | Description |
| --- | --- |
| `<gs-birthday-picker>` | Birthday date input with decade swipe, month grid, and calendar. |

## Install

This package is not published to npm yet. Install directly from GitHub:

```bash
npm install github:jhlee111/gs-components lit
```

Or add it as a local dependency while developing:

```bash
git clone https://github.com/jhlee111/gs-components.git
cd gs-components && npm install && npm run build
# then, from your app:
npm install /absolute/path/to/gs-components lit
```

`lit` is marked `external` in the build, so install it alongside in the host app.

> Note: `dist/` is git-ignored. When installing from GitHub, run `npm run build` inside the package (or use a `prepare` script) so the built files exist before import.

## Usage

Import the full bundle:

```js
import 'gs-components';
```

…or a single component:

```js
import 'gs-components/gs-birthday-picker';
```

Or, without any bundler, load the source directly (requires an import map for `lit`):

```html
<script type="importmap">
  { "imports": { "lit": "https://esm.sh/lit@3" } }
</script>
<script type="module" src="./src/gs-birthday-picker/gs-birthday-picker.js"></script>
```

Then drop the tag into your markup:

```html
<gs-birthday-picker show-age></gs-birthday-picker>

<script type="module">
  const el = document.querySelector('gs-birthday-picker');
  el.addEventListener('gs-birthday-selected', (e) => {
    console.log(e.detail); // { year, month, day, date, iso, age }
  });
</script>
```

## `<gs-birthday-picker>`

Three-step picker: pick a decade, a year, a month, and a day. Decades swipe horizontally on touch devices; months expand into a 3×4 grid; days render as a month calendar.

### Attributes / properties

| Attribute | Property | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `show-age` | `showAge` | boolean | `true` | Show computed age in the result bar. |
| `min-year` | `minYear` | number | `1930` | Earliest selectable year. |
| `max-year` | `maxYear` | number | current year | Latest selectable year; future years are disabled. |
| `default-decade` | `defaultDecade` | number | current year − 30, floored to decade | Decade shown on first open. |
| `value` | `value` | string | `''` | ISO `YYYY-MM-DD`; reflected to attribute. Set to prefill. |

### Events

| Event | Detail |
| --- | --- |
| `gs-birthday-changed` | `{ year, month, day }` — fired on any selection change (partial or complete). |
| `gs-birthday-selected` | `{ year, month, day, date, iso, age }` — fired once all three fields are set. |

Both events bubble and cross shadow DOM boundaries.

### Theming

Override CSS custom properties on (or inside) the element:

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

## Project layout

```
src/
  index.js                      # bundle entry — re-exports every component
  gs-birthday-picker/
    gs-birthday-picker.js       # LitElement + customElements.define
    styles.js                   # component-scoped CSS
  shared/
    theme.js                    # shared design-token CSS (--gs-* → --_*)
playground/                     # manual test harnesses
vite.config.js                  # multi-entry library build
```

## License

[MIT](./LICENSE)
