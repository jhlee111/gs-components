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

import { LitElement, html, css, nothing } from 'lit';

export class GsNumPad extends LitElement {
  static formAssociated = true;

  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static properties = {
    value: { type: String, reflect: true },
    name: { type: String, reflect: true },
    placeholder: { type: String },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    decimals: { type: Number },
    allowNegative: { type: Boolean, attribute: 'allow-negative', reflect: true },
    maxlength: { type: Number },
    required: { type: Boolean, reflect: true },
    format: { type: String },
    locale: { type: String },
    currency: { type: String },
    layout: { type: String, reflect: true },
    autoDecimal: { type: Boolean, attribute: 'auto-decimal', reflect: true },
    doubleZero: { type: Boolean, attribute: 'double-zero', reflect: true },
    disabled: { type: Boolean, reflect: true },
    readonly: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    empty: { type: Boolean, reflect: true },
    focused: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: inline-block;
      font-family: var(--numpad-font, var(--font-sans, system-ui, sans-serif));
      background: var(--numpad-bg, #fff);
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
      color: var(--numpad-display-color, #111);
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
      box-shadow: 0 0 0 2px var(--numpad-submit-bg, #185fa5);
    }

    [part='display-value'][data-empty='true']::before {
      content: attr(data-placeholder);
      color: var(--numpad-placeholder-color, rgba(0, 0, 0, 0.35));
      opacity: 0.6;
    }

    :host([invalid]) [part='display'] {
      color: var(--numpad-invalid-color, #e24b4a);
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
      background: var(--numpad-key-bg, #f0f0f0);
      color: var(--numpad-key-color, #111);
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
      background: var(--numpad-key-bg-active, #e0e0e0);
    }

    button[part~='key']:active {
      transform: scale(0.97);
    }

    button[part~='key']:disabled {
      opacity: var(--numpad-disabled-opacity, 0.3);
      cursor: default;
    }

    button[part~='key-special'] {
      background: var(--numpad-special-bg, #e8e8e8);
      color: var(--numpad-special-color, #111);
    }

    button[part~='key-submit'] {
      background: var(--numpad-submit-bg, #185fa5);
      color: var(--numpad-submit-color, #fff);
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
  `;

  constructor() {
    super();
    this.value = '';
    this.placeholder = '';
    this.decimals = 0;
    this.step = 1;
    this.format = 'plain';
    this.layout = 'phone';
    this.allowNegative = false;
    this.autoDecimal = false;
    this.doubleZero = false;
    this.disabled = false;
    this.readonly = false;
    this.required = false;
    this.invalid = false;
    this.empty = true;
    this.focused = false;
    this._internals = this.attachInternals();
    this._lastChangedValue = '';
    this._invalidReason = null;
    this._wiredExtraKeys = new WeakSet();
  }

  // ─── Form-associated API ────────────────────────────────────────────────

  get form() { return this._internals.form; }
  get validity() { return this._internals.validity; }
  get validationMessage() { return this._internals.validationMessage; }
  get willValidate() { return this._internals.willValidate; }
  checkValidity() { return this._internals.checkValidity(); }
  reportValidity() { return this._internals.reportValidity(); }

  formResetCallback() {
    this.value = this.getAttribute('value') ?? '';
  }

  formDisabledCallback(disabled) {
    this.disabled = disabled;
  }

  // ─── Public methods ─────────────────────────────────────────────────────

  focus() {
    this.updateComplete.then(() => {
      this.shadowRoot?.querySelector('[part="display"]')?.focus();
    });
  }

  blur() {
    this.shadowRoot?.querySelector('[part="display"]')?.blur();
  }

  clear() {
    this._applyKey('clear');
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────

  connectedCallback() {
    super.connectedCallback();
    this._lastChangedValue = this.value;
    this._internals.setFormValue(this.value);
    this._updateValidity();
  }

  willUpdate(changed) {
    if (changed.has('value')) {
      this.empty = this.value === '';
      this._internals.setFormValue(this.value);
      this._updateValidity();
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────

  render() {
    const layoutTop = this.layout === 'calculator' ? ['7', '8', '9'] : ['1', '2', '3'];
    const layoutMid = ['4', '5', '6'];
    const layoutBot = this.layout === 'calculator' ? ['1', '2', '3'] : ['7', '8', '9'];

    const decimals = Number(this.decimals ?? 0);
    const blocked = this.disabled || this.readonly;
    const decimalDisabled = blocked || this.autoDecimal || decimals === 0;
    const dzDisabled = blocked || !this.doubleZero;
    const formatted = this.value === '' ? '' : this._format(this.value);
    const placeholder = this.placeholder ?? '';

    return html`
      <slot name="display">
        <div
          part="display"
          tabindex=${this.disabled ? -1 : 0}
          role="textbox"
          aria-readonly=${blocked ? 'true' : 'false'}
          aria-invalid=${this.invalid ? 'true' : 'false'}
          aria-label=${this.getAttribute('aria-label') ?? nothing}
          @keydown=${this._onKeyDown}
          @focus=${this._onFocus}
          @blur=${this._onBlur}
        >
          <slot name="display-prefix"></slot>
          <span
            part="display-value"
            data-empty=${this.value === '' ? 'true' : 'false'}
            data-placeholder=${placeholder}
          >${formatted}</span>
          <slot name="display-suffix"></slot>
        </div>
      </slot>

      <div part="keypad">
        ${layoutTop.map((d) => this._digit(d, blocked))}
        ${this._special('backspace', '⌫', 'Backspace', blocked)}
        ${layoutMid.map((d) => this._digit(d, blocked))}
        ${this._special('clear', 'C', 'Clear', blocked)}
        ${layoutBot.map((d) => this._digit(d, blocked))}
        <button
          part="key key-double-zero"
          aria-label="Double zero"
          tabindex="-1"
          type="button"
          ?disabled=${dzDisabled}
          @click=${() => this._onKeyClick('00')}
        >00</button>
        <button
          part="key key-digit key-zero"
          aria-label="0"
          tabindex="-1"
          type="button"
          ?disabled=${blocked}
          @click=${() => this._onKeyClick('0')}
        >0</button>
        <button
          part="key key-special key-decimal"
          aria-label="Decimal point"
          tabindex="-1"
          type="button"
          ?disabled=${decimalDisabled}
          @click=${() => this._onKeyClick('decimal')}
        >.</button>
        ${this._special('submit', '✓', 'Submit', blocked)}
      </div>

      <div part="extra-keys">
        <slot name="extra-keys" @slotchange=${this._onExtraSlotChange}></slot>
      </div>
    `;
  }

  _digit(d, disabled) {
    return html`
      <button
        part="key key-digit"
        aria-label=${d}
        tabindex="-1"
        type="button"
        ?disabled=${disabled}
        @click=${() => this._onKeyClick(d)}
      >${d}</button>
    `;
  }

  _special(key, label, aria, disabled) {
    return html`
      <button
        part="key key-special key-${key}"
        aria-label=${aria}
        tabindex="-1"
        type="button"
        ?disabled=${disabled}
        @click=${() => this._onKeyClick(key)}
      >${label}</button>
    `;
  }

  // ─── Event handlers ─────────────────────────────────────────────────────

  _onKeyClick(key) {
    this.shadowRoot?.querySelector('[part="display"]')?.focus();
    this._applyKey(key);
  }

  _onKeyDown(e) {
    if (this.disabled || this.readonly) return;
    const k = e.key;
    if (k >= '0' && k <= '9') {
      e.preventDefault();
      this._applyKey(k);
      return;
    }
    if (k === 'Backspace') { e.preventDefault(); this._applyKey('backspace'); return; }
    if (k === 'Delete') { e.preventDefault(); this._applyKey('clear'); return; }
    if (k === 'Enter') { e.preventDefault(); this._applyKey('submit'); return; }
    if (k === 'Escape') { e.preventDefault(); this.blur(); return; }
    if (k === '.') {
      if (!this.autoDecimal && Number(this.decimals ?? 0) > 0) {
        e.preventDefault();
        this._applyKey('decimal');
      }
      return;
    }
    if (k === '+' || k === '-') {
      if (this.allowNegative) {
        e.preventDefault();
        this._applyKey('sign');
      }
      return;
    }
  }

  _onFocus() { this.focused = true; }

  _onBlur() {
    this.focused = false;
    this._fireChangeIfNeeded();
  }

  _onExtraSlotChange(e) {
    const slot = e.target;
    const assigned = slot.assignedElements();
    assigned.forEach((node) => {
      if (this._wiredExtraKeys.has(node)) return;
      if (!node.dataset || !node.dataset.action) return;
      this._wiredExtraKeys.add(node);
      node.addEventListener('click', (ev) => {
        ev.preventDefault();
        if (this.disabled || this.readonly) return;
        this._applyExtra(node.dataset.action, node.dataset.value ?? '');
      });
    });
  }

  // ─── Core: apply input ──────────────────────────────────────────────────

  _applyKey(key) {
    if (this.disabled || this.readonly) return;
    const prev = this.value;
    let next = prev;

    switch (key) {
      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9':
        next = this._append(prev, key);
        break;
      case '00':
        if (!this.doubleZero) return;
        next = this._append(this._append(prev, '0'), '0');
        break;
      case 'backspace':
        next = this._backspace(prev);
        break;
      case 'clear':
        next = '';
        break;
      case 'sign':
        if (!this.allowNegative) return;
        next = this._toggleSign(prev);
        break;
      case 'decimal':
        // Manual decimal mode is reserved for future versions.
        return;
      case 'submit':
        this._emit('numpad-input', this._inputDetail({
          value: prev,
          previousValue: prev,
          key: 'submit',
          source: 'key',
        }));
        this._fireChangeIfNeeded();
        if (this.form?.requestSubmit) {
          this.form.requestSubmit();
        }
        return;
      default:
        return;
    }

    if (this._exceedsMaxLength(next)) return;

    this.value = next;
    this._emit('numpad-input', this._inputDetail({
      value: next,
      previousValue: prev,
      key,
      source: 'key',
    }));
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this._emitInvalidIfApplicable();
  }

  _applyExtra(action, actionValue) {
    const prev = this.value;
    let next = prev;
    const decimals = Number(this.decimals ?? 0);

    switch (action) {
      case 'append':
        for (const ch of actionValue) {
          if (ch >= '0' && ch <= '9') next = this._append(next, ch);
        }
        break;
      case 'add': {
        const delta = Number(actionValue);
        if (Number.isNaN(delta)) return;
        const cur = prev === '' ? 0 : Number(prev);
        const v = this.autoDecimal
          ? cur + delta / Math.pow(10, decimals)
          : cur + delta;
        next = v === 0 && prev === '' ? '' : v.toFixed(decimals);
        break;
      }
      case 'set': {
        if (actionValue === '' || actionValue == null) { next = ''; break; }
        const n = Number(actionValue);
        if (Number.isNaN(n)) return;
        const v = this.autoDecimal ? n / Math.pow(10, decimals) : n;
        next = v === 0 && decimals === 0 ? '' : v.toFixed(decimals);
        break;
      }
      case 'clear':
        next = '';
        break;
      case 'submit':
        this._applyKey('submit');
        return;
      default:
        return;
    }

    if (this._exceedsMaxLength(next)) return;

    this.value = next;
    this._emit('numpad-input', this._inputDetail({
      value: next,
      previousValue: prev,
      key: 'extra',
      source: 'extra',
      action,
      actionValue,
    }));
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this._emitInvalidIfApplicable();
  }

  // ─── Numeric helpers ────────────────────────────────────────────────────

  _digitsOf(value) {
    return value.replace(/^-/, '').replace('.', '').replace(/^0+/, '');
  }

  _signOf(value) { return value.startsWith('-') ? -1 : 1; }

  _compose(digits, sign) {
    const decimals = Number(this.decimals ?? 0);
    if (digits === '') return '';
    let out;
    if (decimals === 0) {
      out = digits;
    } else {
      const padded = digits.padStart(decimals + 1, '0');
      const intPart = padded.slice(0, -decimals).replace(/^0+(?=\d)/, '');
      const fracPart = padded.slice(-decimals);
      out = `${intPart}.${fracPart}`;
    }
    return sign === -1 ? `-${out}` : out;
  }

  _append(value, digit) {
    return this._compose(this._digitsOf(value) + digit, this._signOf(value));
  }

  _backspace(value) {
    const digits = this._digitsOf(value);
    if (digits.length <= 1) return '';
    return this._compose(digits.slice(0, -1), this._signOf(value));
  }

  _toggleSign(value) {
    if (value === '' || value === '0' || /^0\.0+$/.test(value)) return value;
    return value.startsWith('-') ? value.slice(1) : `-${value}`;
  }

  _exceedsMaxLength(value) {
    const ml = Number(this.maxlength ?? 0);
    if (!ml) return false;
    return this._digitsOf(value).length > ml;
  }

  // ─── Formatting ─────────────────────────────────────────────────────────

  _format(value) {
    if (value === '') return this.placeholder ?? '';
    const num = Number(value);
    if (Number.isNaN(num)) return value;
    const decimals = Number(this.decimals ?? 0);
    const opts = {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    };
    try {
      if (this.format === 'currency') {
        return new Intl.NumberFormat(this.locale, {
          style: 'currency',
          currency: this.currency ?? 'USD',
          ...opts,
        }).format(num);
      }
      if (this.format === 'percent') {
        return new Intl.NumberFormat(this.locale, {
          style: 'percent',
          ...opts,
        }).format(num);
      }
      return new Intl.NumberFormat(this.locale, opts).format(num);
    } catch {
      return value;
    }
  }

  // ─── Validation ─────────────────────────────────────────────────────────

  _updateValidity() {
    const value = this.value;
    const min = this.min !== undefined && this.min !== null ? Number(this.min) : null;
    const max = this.max !== undefined && this.max !== null ? Number(this.max) : null;
    const flags = {};
    let msg = '';
    let reason = null;

    if (this.required && value === '') {
      flags.valueMissing = true;
      msg = 'Required';
      reason = 'required';
    } else if (value !== '' && !Number.isNaN(Number(value))) {
      const num = Number(value);
      if (min !== null && num < min) {
        flags.rangeUnderflow = true;
        msg = `Must be ≥ ${min}`;
        reason = 'min';
      } else if (max !== null && num > max) {
        flags.rangeOverflow = true;
        msg = `Must be ≤ ${max}`;
        reason = 'max';
      }
    }

    const display = this.shadowRoot?.querySelector('[part="display"]');
    const isInvalid = Object.keys(flags).length > 0;
    if (isInvalid) {
      this._internals.setValidity(flags, msg, display ?? undefined);
      this.invalid = true;
    } else {
      this._internals.setValidity({});
      this.invalid = false;
    }
    this._invalidReason = reason;
    return isInvalid;
  }

  _emitInvalidIfApplicable() {
    const isInvalid = this._updateValidity();
    if (isInvalid && this._invalidReason) {
      this._emit('numpad-invalid', {
        value: this.value,
        formattedValue: this._format(this.value),
        reason: this._invalidReason,
        valid: false,
      });
    }
  }

  _fireChangeIfNeeded() {
    if (this.value !== this._lastChangedValue) {
      this._lastChangedValue = this.value;
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
  }

  // ─── Event detail builder ───────────────────────────────────────────────

  _inputDetail({ value, previousValue, key, source, action = null, actionValue = null }) {
    return {
      value,
      formattedValue: this._format(value),
      previousValue,
      key,
      source,
      action,
      actionValue,
    };
  }

  _emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true,
    }));
  }
}

if (!customElements.get('gs-num-pad')) {
  customElements.define('gs-num-pad', GsNumPad);
}
