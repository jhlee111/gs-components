/**
 * GS Components — shared design tokens.
 *
 * Usage in host app (CSS custom properties override):
 *
 *   gs-birthday-picker {
 *     --gs-bg: #ffffff;
 *     --gs-fg: #1a1714;
 *     --gs-accent: #d35322;
 *     --gs-accent-soft: #fef0e8;
 *     --gs-muted: #a09a90;
 *     --gs-border: #e5e1da;
 *     --gs-radius: 16px;
 *     --gs-touch-min: 56px;
 *     --gs-font-family: 'DM Sans', sans-serif;
 *     --gs-font-mono: 'DM Mono', monospace;
 *     --gs-font-serif: 'Instrument Serif', serif;
 *   }
 */

import { css } from 'lit';

export const gsTokens = css`
  :host {
    --_bg: var(--gs-bg, #fff);
    --_fg: var(--gs-fg, #1a1714);
    --_muted: var(--gs-muted, #a09a90);
    --_accent: var(--gs-accent, #d35322);
    --_accent-soft: var(--gs-accent-soft, #fef0e8);
    --_border: var(--gs-border, #e5e1da);
    --_radius: var(--gs-radius, 16px);
    --_touch-min: var(--gs-touch-min, 56px);
    --_font: var(--gs-font-family, 'DM Sans', sans-serif);
    --_font-mono: var(--gs-font-mono, 'DM Mono', monospace);
    --_font-serif: var(--gs-font-serif, 'Instrument Serif', serif);
  }
`;
