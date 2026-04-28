/**
 * GS Components — shared design tokens.
 *
 * Hosts override these CSS custom properties to re-skin every component:
 *
 *   gs-birthday-picker, gs-num-pad {
 *     --gs-bg: #ffffff;
 *     --gs-fg: #1a1714;
 *     --gs-muted: #a09a90;
 *     --gs-accent: #d35322;
 *     --gs-accent-soft: #fef0e8;
 *     --gs-on-accent: #ffffff;
 *     --gs-surface: #f5f3ee;
 *     --gs-surface-strong: #e5e1da;
 *     --gs-danger: #e24b4a;
 *     --gs-border: #e5e1da;
 *     --gs-radius: 16px;
 *     --gs-touch-min: 56px;
 *     --gs-font-family: 'DM Sans', sans-serif;
 *     --gs-font-mono: 'DM Mono', monospace;
 *     --gs-font-serif: 'Instrument Serif', serif;
 *   }
 *
 * Components compose this with their own styles via:
 *
 *   import { gsTokens } from '../shared/theme.js';
 *   static styles = [gsTokens, styles];
 */

import { css } from 'lit';

export const gsTokens = css`
  :host {
    --_bg: var(--gs-bg, #fff);
    --_fg: var(--gs-fg, #1a1714);
    --_muted: var(--gs-muted, #a09a90);
    --_accent: var(--gs-accent, #d35322);
    --_accent-soft: var(--gs-accent-soft, #fef0e8);
    --_on-accent: var(--gs-on-accent, #fff);
    --_surface: var(--gs-surface, #f5f3ee);
    --_surface-strong: var(--gs-surface-strong, #e5e1da);
    --_danger: var(--gs-danger, #e24b4a);
    --_border: var(--gs-border, #e5e1da);
    --_radius: var(--gs-radius, 16px);
    --_touch-min: var(--gs-touch-min, 56px);
    --_font: var(--gs-font-family, 'DM Sans', sans-serif);
    --_font-mono: var(--gs-font-mono, 'DM Mono', monospace);
    --_font-serif: var(--gs-font-serif, 'Instrument Serif', serif);
  }
`;
