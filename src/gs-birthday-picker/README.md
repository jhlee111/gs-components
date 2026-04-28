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
