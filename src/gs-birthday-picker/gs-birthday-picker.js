import { LitElement, html } from 'lit';
import { gsTokens } from '../shared/theme.js';
import { styles } from './styles.js';

export class GsBirthdayPicker extends LitElement {
  static properties = {
    // Public API
    showAge:        { type: Boolean, attribute: 'show-age' },
    minYear:        { type: Number,  attribute: 'min-year' },
    maxYear:        { type: Number,  attribute: 'max-year' },
    defaultDecade:  { type: Number,  attribute: 'default-decade' },
    value:          { type: String,  reflect: true },
    // Internal state
    step:           { type: String,  state: true },
    decadeStart:    { type: Number,  state: true },
    selectedYear:   { type: Number,  state: true },
    selectedMonth:  { type: Number,  state: true },
    selectedDay:    { type: Number,  state: true },
    monthExpanded:  { type: Boolean, state: true },
    _touchStartX:   { type: Number,  state: true },
    _swipeOffset:   { type: Number,  state: true },
    _isSwiping:     { type: Boolean, state: true },
  };

  static styles = [gsTokens, styles];

  constructor() {
    super();
    this.showAge = true;
    this.minYear = 1930;
    this.maxYear = new Date().getFullYear();
    this.defaultDecade = null;
    this.value = '';
    this.step = 'year';
    this.selectedYear = null;
    this.selectedMonth = null;
    this.selectedDay = null;
    this.monthExpanded = true;
    this._touchStartX = 0;
    this._swipeOffset = 0;
    this._isSwiping = false;
  }

  connectedCallback() {
    super.connectedCallback();
    const currentYear = new Date().getFullYear();
    this.decadeStart = this.defaultDecade
      ?? Math.floor((currentYear - 30) / 10) * 10;

    // Parse initial value if provided
    if (this.value) this._parseValue(this.value);
  }

  // --- Computed ---
  get _currentYear() { return new Date().getFullYear(); }
  get _minDecade() { return Math.floor(this.minYear / 10) * 10; }
  get _maxDecade() { return Math.floor(this.maxYear / 10) * 10; }

  get _monthNames() {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }
  get _monthFullNames() {
    return ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
  }
  get _dayNames() { return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']; }

  get _daysInMonth() {
    if (this.selectedYear == null || this.selectedMonth == null) return 0;
    return new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
  }
  get _firstDayOfWeek() {
    if (this.selectedYear == null || this.selectedMonth == null) return 0;
    return new Date(this.selectedYear, this.selectedMonth, 1).getDay();
  }
  get _isComplete() {
    return this.selectedYear != null && this.selectedMonth != null && this.selectedDay != null;
  }
  get _age() {
    if (!this._isComplete) return null;
    const today = new Date();
    let age = today.getFullYear() - this.selectedYear;
    const m = today.getMonth() - this.selectedMonth;
    if (m < 0 || (m === 0 && today.getDate() < this.selectedDay)) age--;
    return age;
  }
  get _formattedDate() {
    if (!this._isComplete) return '';
    return `${this.selectedYear}-${String(this.selectedMonth + 1).padStart(2, '0')}-${String(this.selectedDay).padStart(2, '0')}`;
  }
  get _displayDate() {
    if (!this._isComplete) return '';
    return `${this._monthFullNames[this.selectedMonth]} ${this.selectedDay}, ${this.selectedYear}`;
  }

  // --- Value parsing ---
  _parseValue(v) {
    const match = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return;
    const [, y, m, d] = match.map(Number);
    this.selectedYear = y;
    this.selectedMonth = m - 1;
    this.selectedDay = d;
    this.decadeStart = Math.floor(y / 10) * 10;
    this.monthExpanded = false;
    this.step = 'monthday';
  }

  // --- Decade navigation ---
  _decades() {
    const d = [];
    for (let i = this._minDecade; i <= this._maxDecade; i += 10) d.push(i);
    return d;
  }
  _decadeIndex() { return this._decades().indexOf(this.decadeStart); }
  _goPrevDecade() { if (this.decadeStart > this._minDecade) this.decadeStart -= 10; }
  _goNextDecade() { if (this.decadeStart < this._maxDecade) this.decadeStart += 10; }
  _goToDecade(d) { this.decadeStart = d; }

  // --- Touch/swipe ---
  _onTouchStart(e) {
    this._touchStartX = e.touches[0].clientX;
    this._isSwiping = true;
    this._swipeOffset = 0;
  }
  _onTouchMove(e) {
    if (!this._isSwiping) return;
    this._swipeOffset = e.touches[0].clientX - this._touchStartX;
  }
  _onTouchEnd() {
    if (!this._isSwiping) return;
    this._isSwiping = false;
    if (this._swipeOffset > 60) this._goPrevDecade();
    else if (this._swipeOffset < -60) this._goNextDecade();
    this._swipeOffset = 0;
  }

  // --- Selections ---
  _selectYear(y) {
    this.selectedYear = y;
    this.selectedMonth = null;
    this.selectedDay = null;
    this.monthExpanded = true;
    this.step = 'monthday';
    this._emitChanged();
  }

  _selectMonthFromGrid(m) {
    this.selectedMonth = m;
    this.selectedDay = null;
    this.monthExpanded = false;
    this._emitChanged();
  }

  _expandMonths() {
    this.monthExpanded = true;
  }

  _selectDay(d) {
    this.selectedDay = d;
    this.value = this._formattedDate;
    this._emitChanged();
    this._emitSelected();
  }

  // --- Events ---
  _emitChanged() {
    this.dispatchEvent(new CustomEvent('gs-birthday-changed', {
      detail: {
        year: this.selectedYear,
        month: this.selectedMonth != null ? this.selectedMonth + 1 : null,
        day: this.selectedDay,
      },
      bubbles: true, composed: true,
    }));
  }

  _emitSelected() {
    if (!this._isComplete) return;
    this.dispatchEvent(new CustomEvent('gs-birthday-selected', {
      detail: {
        year: this.selectedYear,
        month: this.selectedMonth + 1,
        day: this.selectedDay,
        date: new Date(this.selectedYear, this.selectedMonth, this.selectedDay),
        iso: this._formattedDate,
        age: this._age,
      },
      bubbles: true, composed: true,
    }));
  }

  _goBackToYear() {
    this.step = 'year';
    this.selectedMonth = null;
    this.selectedDay = null;
    this.monthExpanded = true;
  }

  // --- Render ---
  _renderYearStep() {
    const years = [];
    for (let i = 0; i < 10; i++) years.push(this.decadeStart + i);
    const decades = this._decades();
    const idx = this._decadeIndex();

    return html`
      <div class="year-step fade-in">
        <div class="decade-nav">
          <button class="nav-btn" @click=${this._goPrevDecade} ?disabled=${idx <= 0}>&#8249;</button>
          <span class="decade-label">${this.decadeStart}s</span>
          <button class="nav-btn" @click=${this._goNextDecade} ?disabled=${idx >= decades.length - 1}>&#8250;</button>
        </div>
        <div class="swipe-dots">
          ${decades.map((d, i) => html`
            <div class="swipe-dot ${i === idx ? 'active' : ''}" @click=${() => this._goToDecade(d)}></div>
          `)}
        </div>
        <div class="decade-swipe-area"
             @touchstart=${this._onTouchStart}
             @touchmove=${this._onTouchMove}
             @touchend=${this._onTouchEnd}>
          <div class="decade-page">
            ${years.map(y => html`
              <button class="year-btn ${y > this.maxYear ? 'future' : ''}"
                @click=${() => this._selectYear(y)}>${y}</button>
            `)}
          </div>
        </div>
        <div class="swipe-hint">\u2190 swipe to change decade \u2192</div>
      </div>
    `;
  }

  _renderMonthDayStep() {
    const expanded = this.monthExpanded;

    return html`
      <div class="monthday-step">
        ${expanded ? html`
          <div class="month-expanded fade-in">
            ${this._monthNames.map((name, i) => html`
              <button class="month-grid-btn ${this.selectedMonth === i ? 'selected' : ''}"
                @click=${() => this._selectMonthFromGrid(i)}>${name}</button>
            `)}
          </div>
        ` : null}

        ${!expanded && this.selectedMonth != null ? html`
          <div class="day-panel">
            ${this._renderDayGrid()}
          </div>
        ` : null}
      </div>
    `;
  }

  _renderDayGrid() {
    const totalDays = this._daysInMonth;
    const firstDay = this._firstDayOfWeek;
    const today = new Date();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(html`<div class="day-cell empty"></div>`);
    for (let d = 1; d <= totalDays; d++) {
      const isToday = d === today.getDate()
        && this.selectedMonth === today.getMonth()
        && this.selectedYear === today.getFullYear();
      const isSel = d === this.selectedDay;
      cells.push(html`
        <button class="day-cell ${isSel ? 'selected' : ''} ${isToday ? 'today' : ''}"
          @click=${() => this._selectDay(d)}>${d}</button>
      `);
    }
    return html`
      <div class="day-header">${this._dayNames.map(n => html`<span>${n}</span>`)}</div>
      <div class="day-grid fade-in">${cells}</div>
    `;
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          ${this.step === 'year'
            ? html`
                <span class="header-label">Step 1 \u00b7 Select Year</span>
                ${this.selectedYear != null ? html`<span class="header-value">${this.selectedYear}</span>` : null}
              `
            : html`
                <button class="header-back" @click=${this._goBackToYear}>\u2190 ${this.selectedYear}</button>
                ${!this.monthExpanded && this.selectedMonth != null
                  ? html`<button class="header-month" @click=${this._expandMonths}>
                      ${this._monthFullNames[this.selectedMonth]}
                      <span class="header-month-arrow">\u25be</span>
                    </button>`
                  : html`<span class="header-label">Select Month</span>`
                }
              `}
        </div>
        ${this.step === 'year' ? this._renderYearStep() : this._renderMonthDayStep()}
        ${this._isComplete ? html`
          <div class="result-bar fade-in">
            <span class="result-date">${this._displayDate}</span>
            ${this.showAge ? html`<span class="result-age">${this._age} years old</span>` : null}
          </div>
        ` : null}
      </div>
    `;
  }
}

customElements.define('gs-birthday-picker', GsBirthdayPicker);
