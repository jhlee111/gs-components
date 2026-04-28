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
