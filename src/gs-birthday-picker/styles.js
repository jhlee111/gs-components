import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    font-family: var(--_font);
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .container {
    background: var(--_bg);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.06);
  }

  /* ===== HEADER ===== */
  .header {
    padding: 20px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--_border);
  }
  .header-label {
    font-size: clamp(14px, 1.8vw, 20px);
    font-weight: 500;
    color: var(--_muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .header-value {
    font-size: clamp(16px, 2vw, 22px);
    font-weight: 600;
    color: var(--_fg);
    font-family: var(--_font-mono);
  }
  .header-back {
    background: none;
    border: 1px solid var(--_border);
    border-radius: 12px;
    padding: 12px 20px;
    font-size: clamp(15px, 1.8vw, 20px);
    color: var(--_fg);
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s;
    min-height: var(--_touch-min);
    display: flex;
    align-items: center;
  }
  .header-back:active {
    background: var(--_border);
  }
  .header-month {
    background: var(--_accent);
    border: none;
    border-radius: 12px;
    padding: 10px 20px;
    font-size: clamp(15px, 1.8vw, 20px);
    color: white;
    cursor: pointer;
    font-family: inherit;
    font-weight: 600;
    min-height: var(--_touch-min);
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.15s;
  }
  .header-month:active {
    transform: scale(0.97);
    opacity: 0.85;
  }
  .header-month-arrow {
    font-size: clamp(12px, 1.4vw, 16px);
    opacity: 0.7;
  }

  /* ===== YEAR STEP ===== */
  .year-step { padding: 0; }

  .decade-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 28px 12px;
  }
  .decade-label {
    font-family: var(--_font-serif);
    font-size: clamp(28px, 4vw, 48px);
    color: var(--_fg);
    font-weight: 400;
    min-width: 140px;
    text-align: center;
  }
  .nav-btn {
    width: clamp(52px, 6vw, 72px);
    height: clamp(52px, 6vw, 72px);
    border-radius: 50%;
    border: 1px solid var(--_border);
    background: var(--_bg);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: clamp(22px, 3vw, 32px);
    color: var(--_fg);
    transition: all 0.15s;
    flex-shrink: 0;
  }
  .nav-btn:active {
    background: var(--_border);
    transform: scale(0.93);
  }
  .nav-btn[disabled] {
    opacity: 0.3;
    pointer-events: none;
  }

  .decade-swipe-area {
    position: relative;
    overflow: hidden;
    touch-action: pan-y;
    padding: 12px 24px 24px;
  }

  .decade-page {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: clamp(8px, 1.2vw, 16px);
  }

  .year-btn {
    padding: clamp(16px, 2.5vw, 32px) 8px;
    border-radius: var(--_radius);
    border: 1px solid var(--_border);
    background: var(--_bg);
    font-family: var(--_font-mono);
    font-size: clamp(18px, 2.5vw, 28px);
    color: var(--_fg);
    cursor: pointer;
    transition: all 0.12s;
    text-align: center;
    min-height: clamp(60px, 8vw, 88px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .year-btn:active {
    transform: scale(0.95);
    background: var(--_accent-soft);
    border-color: var(--_accent);
  }
  .year-btn.future {
    opacity: 0.2;
    pointer-events: none;
  }

  .swipe-hint {
    text-align: center;
    font-size: clamp(12px, 1.5vw, 16px);
    color: var(--_muted);
    padding: 4px 0 8px;
  }
  .swipe-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    padding: 8px 0 16px;
  }
  .swipe-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--_border);
    transition: all 0.2s;
    cursor: pointer;
  }
  .swipe-dot.active {
    background: var(--_accent);
    width: 24px;
    border-radius: 4px;
  }

  /* ===== MONTH+DAY STEP ===== */
  .monthday-step {
    display: flex;
    overflow: hidden;
  }

  .month-expanded {
    flex: 1 1 100%;
    padding: clamp(16px, 3vw, 32px);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: clamp(10px, 1.5vw, 18px);
  }

  .month-grid-btn {
    border-radius: var(--_radius);
    border: 2px solid var(--_border);
    background: var(--_bg);
    font-family: inherit;
    font-size: clamp(18px, 2.8vw, 28px);
    font-weight: 500;
    color: var(--_fg);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: clamp(64px, 10vw, 100px);
    transition: all 0.15s;
  }
  .month-grid-btn:active {
    transform: scale(0.95);
    background: var(--_accent-soft);
    border-color: var(--_accent);
  }
  .month-grid-btn.selected {
    background: var(--_accent);
    border-color: var(--_accent);
    color: white;
    font-weight: 600;
  }

  /* ===== DAY PANEL ===== */
  .day-panel {
    flex: 1 1 auto;
    padding: clamp(16px, 2vw, 28px);
    display: flex;
    flex-direction: column;
  }

  .day-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-bottom: 8px;
  }
  .day-header span {
    text-align: center;
    font-size: clamp(12px, 1.5vw, 17px);
    font-weight: 600;
    color: var(--_muted);
    padding: 8px 0;
  }

  .day-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: clamp(4px, 0.6vw, 8px);
    align-content: start;
  }

  .day-cell {
    aspect-ratio: 1;
    border-radius: 50%;
    border: none;
    background: transparent;
    font-family: var(--_font-mono);
    font-size: clamp(15px, 2vw, 22px);
    color: var(--_fg);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.1s;
    min-width: clamp(40px, 5vw, 64px);
    min-height: clamp(40px, 5vw, 64px);
  }
  .day-cell:active {
    transform: scale(0.88);
  }
  .day-cell.selected {
    background: var(--_accent);
    color: white;
    font-weight: 600;
  }
  .day-cell.empty {
    pointer-events: none;
  }
  .day-cell:not(.selected):not(.empty):hover {
    background: var(--_accent-soft);
  }
  .day-cell.today:not(.selected) {
    border: 2px solid var(--_accent);
  }

  /* ===== RESULT BAR ===== */
  .result-bar {
    padding: 20px 28px;
    border-top: 1px solid var(--_border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .result-date {
    font-family: var(--_font-mono);
    font-size: clamp(16px, 2.2vw, 24px);
    color: var(--_fg);
    font-weight: 500;
  }
  .result-age {
    font-size: clamp(14px, 2vw, 22px);
    color: var(--_accent);
    font-weight: 600;
  }

  /* ===== ORIENTATION ===== */
  @media (orientation: portrait) {
    .decade-page {
      grid-template-columns: repeat(2, 1fr);
    }
    .year-btn {
      min-height: clamp(64px, 10vw, 100px);
      font-size: clamp(20px, 4vw, 32px);
    }
    .month-grid-btn {
      min-height: clamp(72px, 12vw, 110px);
      font-size: clamp(18px, 3.5vw, 30px);
    }
  }

  @media (orientation: landscape) {
    .decade-page {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  .fade-in {
    animation: fadeIn 0.25s ease-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
