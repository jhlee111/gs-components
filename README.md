# gs-components

Web components for GsNet — touch-first, themeable, built with [Lit](https://lit.dev).

Each component ships as a standalone ES module that defines its own custom element, so you can import just what you need. Styling is driven by CSS custom properties (`--gs-*`) so host apps can theme components without forking them.

## Components

| Tag | Description |
| --- | --- |
| `<gs-birthday-picker>` | Birthday date input with decade swipe, month grid, and calendar. |

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

## Phoenix LiveView

Custom elements are plain `HTMLElement`s, so Phoenix hooks attach directly — no wrapper `<div>` needed. Add `phx-update="ignore"` so LiveView's DOM diff does not patch over the component's internal state on re-render.

```heex
<gs-birthday-picker
  id="birthday-picker"
  phx-hook="GsBirthdayPicker"
  phx-update="ignore"
  value={@birthday}
  show-age
/>
```

The hook imports the component once and forwards `gs-birthday-selected` to the server. Pick explicit fields from `detail` — `detail.date` is a JS `Date` object and won't JSON-serialize cleanly.

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

Register it in `app.js`:

```js
import { GsBirthdayPicker } from "./hooks/gs_birthday_picker";

let liveSocket = new LiveSocket("/live", Socket, {
  hooks: { GsBirthdayPicker },
  // ...
});
```

Server handler:

```elixir
def handle_event("birthday-selected", %{"iso" => iso, "age" => age}, socket) do
  {:noreply, assign(socket, birthday: iso, age: age)}
end
```

Use `gs-birthday-changed` instead of `gs-birthday-selected` if you need partial selections (e.g. to show a "keep going" hint before the user has picked a day).

### Prefilling and server-driven updates

The `value` attribute is read on mount, so `value={@birthday}` handles the **initial** value. Because `phx-update="ignore"` stops LiveView from patching this element after mount, later changes to `@birthday` won't flow into the DOM automatically. Push them through the hook instead:

```elixir
# server
{:noreply, push_event(socket, "set-birthday", %{value: "1990-05-12"})}
```

```js
// hook mounted()
this.handleEvent("set-birthday", ({ value }) => {
  this.el.value = value;
});
```

Setting `this.el.value` writes the property directly, which the component picks up and re-renders from. Skip this block if the server only ever *receives* the value (typical form flow) — then the initial `value={@birthday}` is all you need.

## `<gs-birthday-picker>`

Three-step picker: pick a decade, a year, a month, and a day. Decades swipe horizontally on touch devices; months expand into a 3×4 grid; days render as a month calendar.

### Sizing

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
<!-- Component grows to content; fine for long scrollable host pages. -->
<gs-birthday-picker></gs-birthday-picker>
```

When a definite height is given, internal panels flex-fill that box and the year grid uses `1fr` rows. When no height is given, the component renders at its natural content height. Panels reserve 5rem of bottom padding for the absolutely-positioned result bar, so selecting a date does not cause layout shift.

Container-query breakpoints (evaluated on the host's own box, not the viewport):

| Host size | Layout |
| --- | --- |
| Default (tall / portrait) | Year step stacked vertically; 5-col year grid (2-col in portrait viewports). |
| `max-height: 480px and min-width: 700px` (e.g. landscape phone) | Year step reshapes into 2-col: decade nav + hint + dots on the left, year grid on the right. Month grid compresses to 4×3. |

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
