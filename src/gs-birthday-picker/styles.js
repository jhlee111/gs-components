import { css } from 'lit';

export const styles = css`
  /* ============================================================
     BOX MODEL / SIZING PHILOSOPHY
     ------------------------------------------------------------
     The component is intentionally box-agnostic:

       - :host sets display:block with NO height/max-height.
       - The consumer chooses the outer size by wrapping the element
         (e.g. a div with height: 520px, or min-height / 100svh-based).
       - When a height is given, .container fills it (height: 100%)
         and internal panels flex-fill to consume the available space.
       - When no height is given, the component sizes to its natural
         content (acceptable for long, scrollable host pages).

     We also opt-in to container queries via container-type: size so
     the shadow DOM can adapt to the HOST'S actual box, not the
     viewport. This is what allows the compact 2-column year step to
     kick in on short+wide hosts (e.g. landscape phones) even when
     the host page itself is a totally different size.
     ============================================================ */
  :host {
    display: block;
    font-family: var(--_font);
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
    container-type: size;
    container-name: picker;
  }

  .container {
    position: relative;
    background: var(--_bg);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.06);
    display: flex;
    flex-direction: column;
    /* When the host has a definite height, fill it. When the host is
       content-sized, height: 100% resolves to auto and the container
       sizes to its children instead. */
    height: 100%;
  }

  /* ===== HEADER ===== */
  .header {
    flex: 0 0 auto;
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
  .year-step {
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
    /* 5rem bottom padding reserves space for the absolute result-bar
       so selected-state content isn't hidden beneath it. */
    padding: 0 0 5rem;
    display: flex;
    flex-direction: column;
  }

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
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .decade-page {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-auto-rows: 1fr;
    gap: clamp(8px, 1.2vw, 16px);
    flex: 1 1 auto;
    min-height: 0;
  }

  .year-btn {
    padding: 8px;
    border-radius: var(--_radius);
    border: 1px solid var(--_border);
    background: var(--_bg);
    font-family: var(--_font-mono);
    font-size: clamp(18px, 2.5vw, 28px);
    color: var(--_fg);
    cursor: pointer;
    transition: all 0.12s;
    text-align: center;
    min-height: 48px;
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
    padding-bottom: 5rem;
    flex: 1 1 auto;
    min-height: 0;
  }

  .month-expanded {
    flex: 1 1 100%;
    padding: clamp(16px, 3vw, 32px);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: clamp(10px, 1.5vw, 18px);
    max-width: 36rem;
    margin: 0 auto;
    min-height: 0;
  }

  .month-grid-btn {
    border-radius: var(--_radius);
    border: 2px solid var(--_border);
    background: var(--_bg);
    font-family: inherit;
    font-size: clamp(16px, 2.4vw, 24px);
    font-weight: 500;
    color: var(--_fg);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 56px;
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
    padding: clamp(12px, 2vw, 28px);
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 0;
  }

  .day-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-bottom: 8px;
    width: 100%;
    max-width: 32rem;
    flex: 0 0 auto;
  }
  .day-header span {
    text-align: center;
    font-size: clamp(12px, 1.5vw, 17px);
    font-weight: 600;
    color: var(--_muted);
    padding: 6px 0;
  }

  .day-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, 1fr);
    gap: clamp(4px, 0.6vw, 8px);
    width: 100%;
    max-width: 32rem;
    flex: 1 1 auto;
    min-height: 0;
  }

  .day-cell {
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
    min-height: 40px;
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
  /* Overlays the bottom of the container as absolute so step transitions
     don't cause the host to grow in height when a date is selected. Panels
     reserve 5rem of bottom padding to avoid being hidden behind it. */
  .result-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px 28px;
    border-top: 1px solid var(--_border);
    background: var(--_bg);
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

  /* ===== ORIENTATION (viewport-based fallbacks) =====
     These still use viewport orientation so that portrait phones (where
     the host is typically full-width) get a 2-col year grid by default.
     Container-query rules below override these when the host box is
     short+wide regardless of viewport. */
  @media (orientation: portrait) {
    .decade-page {
      grid-template-columns: repeat(2, 1fr);
    }
    .year-btn {
      font-size: clamp(20px, 4vw, 32px);
    }
    .month-grid-btn {
      font-size: clamp(18px, 3.5vw, 30px);
    }
  }

  @media (orientation: landscape) {
    .decade-page {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  /* ===== COMPACT MODE (short + wide host box) =====
     Container query on the HOST's own size. Targets landscape-phone-ish
     hosts (<=480px tall, >=700px wide) regardless of what the outer
     viewport actually is. In this mode we rearrange the year step into
     a 2-column layout (decade nav + hint + dots stacked on the left,
     year grid filling the right), and compress the month grid so its
     vertical footprint shrinks. Template shape is unchanged; this is
     pure CSS grid-column/grid-row placement. */
  @container picker (max-height: 480px) and (min-aspect-ratio: 5 / 4) {
    .year-step {
      display: grid;
      grid-template-columns: minmax(220px, 1fr) 2fr;
      grid-template-rows: auto 1fr auto;
      column-gap: 16px;
      padding: 0 16px 5rem;
    }

    .decade-nav {
      grid-column: 1;
      grid-row: 1;
      padding: 12px 4px 8px;
    }
    .decade-label {
      font-size: clamp(24px, 3vw, 36px);
      min-width: 100px;
    }

    .swipe-hint {
      grid-column: 1;
      grid-row: 2;
      align-self: end;
      padding: 4px 0;
    }
    .swipe-dots {
      grid-column: 1;
      grid-row: 3;
      padding: 4px 0 8px;
    }

    .decade-swipe-area {
      grid-column: 2;
      grid-row: 1 / -1;
      padding: 8px 8px 8px 0;
    }
    /* 5 cols x 2 rows of year buttons for a wide, short space. */
    .decade-page {
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(2, 1fr);
      grid-auto-rows: unset;
    }
    .year-btn {
      font-size: clamp(16px, 2vw, 22px);
      min-height: 40px;
      padding: 4px;
    }

    /* Compress the month grid to 4 cols x 3 rows (was 3x4) so its
       vertical footprint fits a short host without overflow. */
    .month-expanded {
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(3, 1fr);
      padding: clamp(8px, 1.5vw, 16px);
      gap: clamp(6px, 1vw, 12px);
      max-width: none;
    }
    .month-grid-btn {
      min-height: 40px;
      font-size: clamp(14px, 1.8vw, 20px);
    }

    /* Day panel already uses repeat(6, 1fr) rows which handles a short
       box naturally; just tighten padding and minimums. */
    .day-panel {
      padding: clamp(6px, 1vw, 12px);
    }
    .day-cell {
      min-height: 28px;
      font-size: clamp(13px, 1.6vw, 18px);
    }

    /* Shrink the header and result-bar paddings so they don't dominate
       a short host. */
    .header {
      padding: 10px 20px;
    }
    .result-bar {
      padding: 10px 20px;
    }

    .monthday-step {
      padding-bottom: 4rem;
    }
    .year-step {
      padding-bottom: 4rem;
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
