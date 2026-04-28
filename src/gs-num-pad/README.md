# `<gs-num-pad>`

A framework-agnostic, form-associated numeric keypad for touch-first web apps. Built with [Lit](https://lit.dev/).

Designed primarily for tablet UIs (iPad landscape POS, kiosks, data entry) where the OS soft keyboard would consume too much viewport. Validated against Phoenix LiveView, but works in any framework or vanilla DOM.

```html
<gs-num-pad
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
```

---

## Install

```bash
npm install gs-webcomponents lit
```

`lit` is a peer dependency. Import the component once in your app entry:

```js
import 'gs-webcomponents/gs-num-pad';
```

After import, `<gs-num-pad>` is registered globally and can be used anywhere in your HTML. The component re-checks `customElements.get('gs-num-pad')` before defining, so importing it twice from different bundles is safe.

---

## Quick start

### Basic POS-style currency input

```html
<form id="checkout">
  <gs-num-pad
    name="total"
    format="currency"
    currency="USD"
    decimals="2"
    auto-decimal
    placeholder="$0.00"
  ></gs-num-pad>
</form>

<script>
  const pad = document.querySelector('gs-num-pad');
  pad.addEventListener('change', () => {
    console.log('Final value:', pad.value); // "12.34"
  });
</script>
```

### Plain integer input

```html
<gs-num-pad name="quantity" placeholder="0" min="1" max="99"></gs-num-pad>
```

---

## Value contract

The `value` attribute and form-submitted value are **always** the canonical, unformatted number string:

| Display (formatted) | `value` (canonical) |
| --- | --- |
| `$12.34` | `"12.34"` |
| `₩1,234,567` | `"1234567"` |
| `12.5%` (in percent format) | `"0.125"` |
| empty | `""` |

Currency symbols, thousand separators, and percent signs are applied to the visible display only and never enter `value`. Hosts always read raw numeric strings parseable by `Number()` or `parseFloat()`.

---

## Attributes

### Value

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | string | `""` | Canonical, unformatted number string. Reflects to property. |
| `name` | string | — | Form field name. |
| `placeholder` | string | — | Shown in the display when `value` is empty. |

### Constraints

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `min` | number | — | Minimum value. Violations fire `numpad-invalid`; input is **not blocked**. |
| `max` | number | — | Maximum value. Violations fire `numpad-invalid`; input is **not blocked**. |
| `step` | number | `1` | Increment unit. |
| `decimals` | integer | `0` | Allowed decimal places. With `auto-decimal`, enforced automatically. |
| `allow-negative` | boolean | absent | Enables the `±` key. |
| `maxlength` | integer | — | Max digit count (excludes sign and decimal). Excess input is **blocked**. |
| `required` | boolean | absent | Standard form-validation `required`. |

### Formatting

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `format` | `"plain" \| "currency" \| "percent"` | `"plain"` | Display formatting mode. |
| `locale` | string | (browser default) | BCP-47 locale (`"en-US"`, `"ko-KR"`, etc.). |
| `currency` | string | — | ISO 4217 currency code, used when `format="currency"`. |

### Layout & behavior

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `layout` | `"phone" \| "calculator"` | `"phone"` | Digit arrangement. `phone` puts 1-2-3 on top; `calculator` puts 7-8-9 on top. |
| `auto-decimal` | boolean | absent | Cents-style accumulator (`1`, `2`, `3`, `4` → `$12.34`). Hides the `.` key. |
| `double-zero` | boolean | absent | Enables the `00` key. |
| `disabled` | boolean | absent | Disables all input. |
| `readonly` | boolean | absent | Value visible but read-only. |

### Reflected state (read-only, set by component)

These reflect to attributes so hosts can target them with CSS.

| Attribute | Description |
| --- | --- |
| `invalid` | Current value violates a constraint. |
| `empty` | `value === ""`. |
| `focused` | Display has focus. |

---

## Properties

| Property | Type | Description |
| --- | --- | --- |
| `value` | `string` | Get/set canonical value. |
| `name` | `string` | Get/set form name. |
| `disabled` | `boolean` | Get/set disabled. |
| `validity` | `ValidityState` | Standard validity state. |
| `validationMessage` | `string` | Standard. |
| `willValidate` | `boolean` | Standard. |
| `form` | `HTMLFormElement \| null` | Standard form-associated property. |

## Methods

| Method | Description |
| --- | --- |
| `focus()` | Focus the display. |
| `blur()` | Blur the display. |
| `clear()` | Programmatically clear value (fires `input` and `numpad-input`). |
| `checkValidity()` | Standard. |
| `reportValidity()` | Standard. |

---

## Events

### Standard events

The component is form-associated and fires standard events for native form integration. **No framework-specific hooks are required for basic binding.**

| Event | When |
| --- | --- |
| `input` | After every value change (key press, keyboard, programmatic). |
| `change` | When the value differs from the last `change` and one of: `✓` is pressed, the display loses focus. |
| `focus` / `blur` | Standard focus events on the display. |

### Custom events

#### `numpad-input`

Fires after every input action — keypad press, hardware keyboard key, or extra-keys button. Use this when you need to know **what** the user did.

```ts
detail: {
  value: string;            // canonical value after the action
  formattedValue: string;   // formatted value after the action
  previousValue: string;    // canonical value before the action
  key: string;              // "0".."9" | "00" | "backspace" | "clear" | "submit" | "sign" | "extra"
  source: "key" | "extra";  // "key" = keypad/keyboard; "extra" = slotted extra-keys button
  action: "append" | "add" | "set" | "clear" | "submit" | null;  // only when source === "extra"
  actionValue: string | null;                                     // only when source === "extra"
}
```

#### `numpad-invalid`

Fires after every input event while `value` violates a constraint. Hosts that only care about transitions can compare against previous state.

```ts
detail: {
  value: string;
  formattedValue: string;
  reason: "min" | "max" | "maxlength" | "required";
  valid: false;
}
```

---

## Slots

| Slot | Description |
| --- | --- |
| (default `display`) | Replaces the entire built-in display. The host owns rendering and listens to `numpad-input` to update its DOM. |
| `display-prefix` | Prepended to the built-in display (e.g. `$`, custom unit). |
| `display-suffix` | Appended to the built-in display (e.g. `kg`, `%`). |
| `extra-keys` | Container for host-defined shortcut buttons. Each button may declare `data-action` and `data-value` to delegate behavior. |

### Extra keys vocabulary

Buttons placed in the `extra-keys` slot can declare `data-action` to be intercepted by the component:

| `data-action` | `data-value` | Effect |
| --- | --- | --- |
| `append` | string of digits | Appends digits as if typed. |
| `add` | number (may be negative) | Adds to current numeric value. |
| `set` | number | Replaces the value. |
| `clear` | (ignored) | Same as pressing `C`. |
| `submit` | (ignored) | Same as pressing `✓`. |

> In `auto-decimal` mode, `add` and `set` interpret `data-value` in **scaled units** (e.g. cents). For `decimals="2"`, `data-value="1000"` adds $10.00.

If a button has no `data-action`, the component does not intercept its click — the host can wire a regular event listener.

```html
<gs-num-pad name="amount" format="currency" currency="USD" decimals="2" auto-decimal>
  <button slot="extra-keys" type="button" data-action="add" data-value="1000">+$10</button>
  <button slot="extra-keys" type="button" data-action="add" data-value="5000">+$50</button>
  <button slot="extra-keys" type="button" data-action="set" data-value="0">Reset</button>
</gs-num-pad>
```

---

## Styling

The component participates in the shared `gs-components` theme system. Color CSS variables fall back through the shared `--gs-*` namespace, so setting `--gs-accent` or `--gs-surface` once on a host (or higher) re-skins this component along with every other gs-component. Use the component-specific `--numpad-*` variables only when you need to diverge from the shared theme.

The component exposes a **CSS Custom Properties first** API. Use `::part()` for fine-grained overrides where variables aren't enough.

### Sizing — outer

| Variable | Default |
| --- | --- |
| `--numpad-padding` | `12px` |
| `--numpad-radius` | `12px` |
| `--numpad-gap` | `8px` |

### Sizing — display

| Variable | Default |
| --- | --- |
| `--numpad-display-padding` | `14px 14px` |
| `--numpad-display-min-height` | `48px` |
| `--numpad-display-size` | `32px` |

### Sizing — keys

Width is determined by the host's `width`/`max-width` divided across the 4-column grid. Height has two control modes:

- **Padding-driven (default)**: set `--numpad-key-padding` and let height adapt.
- **Fixed-height**: set `--numpad-key-height` to lock height regardless of padding.

| Variable | Default |
| --- | --- |
| `--numpad-key-padding` | `14px 0` |
| `--numpad-key-height` | `auto` |
| `--numpad-key-radius` | `8px` |
| `--numpad-key-size` | `22px` (font-size) |

### Colors

| Variable | Default |
| --- | --- |
| `--numpad-bg` | `#fff` |
| `--numpad-display-bg` | transparent |
| `--numpad-display-color` | `#111` |
| `--numpad-key-bg` | `#f0f0f0` |
| `--numpad-key-bg-active` | `#e0e0e0` |
| `--numpad-key-color` | `#111` |
| `--numpad-special-bg` | `#e8e8e8` |
| `--numpad-special-color` | `#111` |
| `--numpad-submit-bg` | `#185fa5` |
| `--numpad-submit-color` | `#fff` |
| `--numpad-invalid-color` | `#e24b4a` |
| `--numpad-placeholder-color` | `rgba(0,0,0,0.35)` |

### Typography & state

| Variable | Default |
| --- | --- |
| `--numpad-font` | inherits from `var(--font-sans)` or `system-ui` |
| `--numpad-disabled-opacity` | `0.3` |

### Parts

```css
gs-num-pad::part(display)            /* display area (focusable) */
gs-num-pad::part(display-value)      /* the value text inside display */
gs-num-pad::part(keypad)             /* the keys grid */
gs-num-pad::part(extra-keys)         /* extra-keys container */
gs-num-pad::part(key)                /* every key */
gs-num-pad::part(key-digit)          /* 0–9 */
gs-num-pad::part(key-zero)           /* the 0 key (spans 2 cells) */
gs-num-pad::part(key-double-zero)    /* the 00 key */
gs-num-pad::part(key-special)        /* ⌫, C, ±, ✓, . */
gs-num-pad::part(key-backspace)      /* ⌫ */
gs-num-pad::part(key-clear)          /* C */
gs-num-pad::part(key-submit)         /* ✓ */
gs-num-pad::part(key-decimal)        /* . */
```

Keys carry multiple parts — for example, `✓` has `part="key key-special key-submit"`.

### State selectors

```css
:host([invalid])      /* current value violates min/max */
:host([disabled])
:host([readonly])
:host([empty])        /* value is "" */
:host([focused])      /* display has focus */
:host(:focus-within)  /* CSS-native equivalent of [focused] */
```

### Sizing presets

```css
/* Compact (sidebar, narrow column) */
gs-num-pad.compact {
  max-width: 260px;
  --numpad-gap: 6px;
  --numpad-padding: 8px;
  --numpad-display-size: 22px;
  --numpad-display-padding: 10px 10px;
  --numpad-display-min-height: 40px;
  --numpad-key-size: 17px;
  --numpad-key-padding: 10px 0;
  --numpad-key-radius: 8px;
}

/* Comfortable (desktop / casual touch) */
gs-num-pad.comfortable {
  max-width: 380px;
  --numpad-gap: 10px;
  --numpad-padding: 14px;
  --numpad-display-size: 36px;
  --numpad-display-padding: 18px 16px;
  --numpad-key-size: 26px;
  --numpad-key-height: 64px;
  --numpad-key-radius: 12px;
}

/* Tablet POS (iPad landscape, kiosk) */
gs-num-pad.tablet {
  max-width: 440px;
  --numpad-gap: 12px;
  --numpad-padding: 16px;
  --numpad-display-size: 44px;
  --numpad-display-padding: 22px 20px;
  --numpad-display-min-height: 80px;
  --numpad-key-size: 30px;
  --numpad-key-height: 78px;
  --numpad-key-radius: 14px;
}
```

> Apple HIG recommends a minimum touch target of 44pt; Material recommends 48dp. The Tablet preset deliberately exceeds both.

---

## Focus & keyboard

The component host (`<gs-num-pad>`) is **not directly focusable**. Focus is delegated (via `delegatesFocus: true`) to an internal display element, which has `tabindex="0"`. Keypad buttons are not in the tab order. `Tab` enters the component once and exits on the next press.

When the display has focus, the component intercepts:

| Physical key | Maps to |
| --- | --- |
| `0`–`9`, `Numpad0`–`Numpad9` | Corresponding digit |
| `Backspace` | `⌫` |
| `Delete` | `C` |
| `Enter`, `NumpadEnter` | `✓` (also requests form submit) |
| `Escape` | `blur()` |
| `.`, `NumpadDecimal` | `.` (only when not in `auto-decimal` mode) |
| `+` / `-` | `±` (only when `allow-negative` is set) |

---

## Form integration

### Phoenix LiveView

Because `<gs-num-pad>` is a form-associated custom element, it works with `phx-change` and `phx-submit` natively. **No LiveView hook is required.**

```heex
<.form for={@form} phx-change="validate" phx-submit="save">
  <gs-num-pad
    id="amount-pad"
    name={@form[:amount].name}
    value={@form[:amount].value}
    format="currency"
    currency="USD"
    decimals="2"
    auto-decimal
    min="0.01"
    max="9999.99"
    placeholder="$0.00"
    phx-update="ignore"
  />
</.form>
```

**Why `phx-update="ignore"`:** the component is reactive and reflects all attribute changes immediately, including `value`. Without `phx-update="ignore"`, a server-side re-render mid-input would clobber the user's in-progress value. The host opts into LiveView-controlled rendering only when needed (e.g. form reset, server-side normalization). To force a value update from the server, change the element's `id` (forces remount) or briefly drop `phx-update="ignore"`.

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

### Vanilla form

```html
<form>
  <gs-num-pad name="amount" format="currency" currency="USD" decimals="2" auto-decimal></gs-num-pad>
  <button type="submit">Submit</button>
</form>

<script>
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    console.log(data.get('amount')); // "12.34"
  });
</script>
```

Pressing `✓` on the keypad calls `form.requestSubmit()`, the same as pressing Enter in a native input.

### React

```jsx
import 'gs-webcomponents/gs-num-pad';
import { useRef, useEffect, useState } from 'react';

function AmountInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const handler = () => onChange(el.value);
    el.addEventListener('change', handler);
    return () => el.removeEventListener('change', handler);
  }, [onChange]);

  return (
    <gs-num-pad
      ref={ref}
      name="amount"
      value={value}
      format="currency"
      currency="USD"
      decimals="2"
      auto-decimal=""
    />
  );
}
```

> React 19+ supports custom-element props natively. For older React, you may need [`@lit/react`](https://lit.dev/docs/frameworks/react/) or a `ref`-based approach as shown.

---

## Validation behavior

| Constraint | Behavior |
| --- | --- |
| `maxlength` | **Blocks** input that would exceed it. No event fires. |
| `min`, `max` | **Allows** input. Sets `[invalid]` attribute. Fires `numpad-invalid`. Sets `ValidityState.rangeUnderflow` / `rangeOverflow`. Form submit is blocked by standard browser validation. |
| `required` | Standard form validation blocks submit when `value === ""`. |
| `decimals` (in `auto-decimal` mode) | Enforced automatically — invalid state not reachable. |

The `[invalid]` attribute reflects current validity at all times. The `numpad-invalid` event fires on every input action while invalid; hosts that only care about transitions should debounce or compare against the previous state.

---

## Auto-decimal mode

When `auto-decimal` is set and `decimals > 0`, digit input is accumulated into the cents (or equivalent) representation:

| Keys pressed | `value` | Display (USD) |
| --- | --- | --- |
| `1` | `"0.01"` | `$0.01` |
| `1`, `2` | `"0.12"` | `$0.12` |
| `1`, `2`, `3` | `"1.23"` | `$1.23` |
| `1`, `2`, `3`, `4` | `"12.34"` | `$12.34` |
| `1`, `2`, `3`, `4`, `5` | `"123.45"` | `$123.45` |

`⌫` removes the rightmost digit. `C` resets to `""`. `00` (when enabled) appends two zeros. The `.` key is hidden/disabled.

`maxlength` applies to the digit count (e.g. `maxlength="8"` allows up to `$999,999.99`).

This is the standard behavior in Square, Toast, Clover, and most POS systems.

---

## Browser support

The component requires **`ElementInternals`** and **form-associated custom elements**:

| Browser | Minimum |
| --- | --- |
| Chrome / Edge | 77+ |
| Firefox | 98+ |
| Safari (macOS / iPadOS / iOS) | 16.4+ |

For older browsers, [`element-internals-polyfill`](https://github.com/calebdwilliams/element-internals-polyfill) provides a fallback.

---

## Examples

### POS USD

```html
<gs-num-pad
  name="total"
  format="currency"
  currency="USD"
  decimals="2"
  auto-decimal
  double-zero
  min="0.01"
  max="9999.99"
  maxlength="8"
  placeholder="$0.00"
>
  <button slot="extra-keys" type="button" data-action="add" data-value="500">+$5</button>
  <button slot="extra-keys" type="button" data-action="add" data-value="1000">+$10</button>
  <button slot="extra-keys" type="button" data-action="add" data-value="2000">+$20</button>
  <button slot="extra-keys" type="button" data-action="set" data-value="0">Reset</button>
</gs-num-pad>
```

### KRW (no decimals)

```html
<gs-num-pad
  name="amount"
  format="currency"
  currency="KRW"
  locale="ko-KR"
  decimals="0"
  double-zero
  placeholder="₩0"
></gs-num-pad>
```

### Quantity (integer with bounds)

```html
<gs-num-pad
  name="quantity"
  decimals="0"
  min="1"
  max="999"
  maxlength="3"
  placeholder="0"
></gs-num-pad>
```

### Weight with custom suffix

```html
<gs-num-pad name="weight" decimals="2" auto-decimal placeholder="0.00">
  <span slot="display-suffix">kg</span>
</gs-num-pad>
```

---

## Limitations

These are out of scope for v1 and may be added later:

- **Manual decimal mode** — when `auto-decimal` is absent and `decimals > 0`, the `.` key is shown but pressing it has no effect. Use `auto-decimal` for decimal input.
- **Popup / overlay mode** — the component is inline-only. A popup variant would be a separate wrapper element.
- **Long-press on `⌫`** — single press only; no key-repeat or hold-to-clear.
- **ARIA live region** — assistive tech does not currently receive value-change announcements.
- **Internationalized digit glyphs** — display formatting respects locale, but key labels are always ASCII.

---

## License

MIT
