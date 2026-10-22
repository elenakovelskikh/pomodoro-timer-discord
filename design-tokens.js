// Design tokens — the one source for both the site (loaded as a plain <script>, exposes
// window.DESIGN_TOKENS) and Storybook (reads it with require, or imports it for the global).
//
// PALETTE: primitives — raw values named by hue and step. Nothing in the UI should use them directly.
// MODE_COLORS: per-mode semantic colors, also read by the SVG ring and the colored shadows.
// THEME: semantic color tokens plugged into Tailwind, so markup uses class names like
//   text-secondary, bg-button-secondary, ring-radio-selected.
// TYPE / typePlugin: text styles as type-* classes (type-heading, type-body, ...).
// Tailwind's own color palette and font-size scale are replaced, not extended, so classes
// like text-neutral-500 or text-sm no longer exist and only these tokens can be used.
(function (root) {
  const PALETTE = {
    neutral: {
      0: "#ffffff",
      100: "#f0f0f0",
      200: "#e5e5e5",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      900: "#171717",
    },
    violet: { 50: "#f5f3ff", 200: "#d1baf6", 500: "#7c3aed", 700: "#6d28d9" },
    blue: { 200: "#abdef5", 500: "#009ae2", 700: "#006da1" },
    teal: { 200: "#abdedd", 500: "#009c99", 700: "#007371" },
  };
  const P = PALETTE;

  // accent: mode label and Start/Resume; accentHover: Start/Resume on hover;
  // arc: progress arc and its cap; shadow: ring tip shadow and the colored button shadows
  const MODE_COLORS = {
    focus: { accent: P.violet[500], accentHover: P.violet[700], arc: P.violet[200], shadow: P.violet[700] },
    break: { accent: P.blue[500], accentHover: P.blue[700], arc: P.blue[200], shadow: P.blue[700] },
    longBreak: { accent: P.teal[500], accentHover: P.teal[700], arc: P.teal[200], shadow: P.teal[700] },
  };

  const THEME = {
    colors: { transparent: "transparent", current: "currentColor" },
    textColor: {
      primary: P.neutral[900],
      label: P.neutral[600],
      secondary: P.neutral[500],
      muted: P.neutral[400],
      // tertiary buttons: text-only actions ("Start long break", "Add more rounds", log toggles)
      // and the text of unselected radio pills
      "button-tertiary": P.neutral[500],
      "button-tertiary-hover": P.neutral[600],
      // selected radio pill (unselected pills use the tertiary button colors)
      "radio-selected": P.violet[500],
      // text and icons on the colored buttons: popup CTA and the mode-colored Start/Resume
      "button-primary": P.neutral[0],
      // secondary buttons: icons and text on the gray buttons (stepper, Reset, Skip, Pause, Cancel)
      "button-secondary": P.neutral[600],
      "button-secondary-hover": P.neutral[700],
      mode: "var(--mode-accent)",
      // the dark status pill ("Reconnecting…", "Not synced") in the Discord Activity
      notice: P.neutral[0],
    },
    backgroundColor: {
      page: P.neutral[0],
      overlay: "rgb(255 255 255 / 0.6)",
      // primary buttons: the violet popup CTA
      "button-primary": P.violet[500],
      "button-primary-hover": P.violet[700],
      // secondary buttons: the gray ones (stepper, Reset, Skip, Pause, Cancel)
      "button-secondary": P.neutral[100],
      "button-secondary-hover": P.neutral[200],
      "radio-selected": P.violet[50],
      // Start/Resume: a primary-level button in the current mode color
      "button-mode": "var(--mode-accent)",
      "button-mode-hover": "var(--mode-accent-hover)",
      notice: P.neutral[900],
    },
    borderColor: { subtle: P.neutral[200] },
    ringColor: { "radio-selected": P.violet[500], radio: P.neutral[200], "radio-hover": P.neutral[400] },
    // SVG strokes
    stroke: { "ring-track": P.neutral[100] },
    // Tailwind's font-size scale is switched off: text sizes only come from the type-* styles below,
    // so text-* classes always mean a color.
    fontSize: {},
  };

  // Text styles: size, line height and weight (and tracking) in one class, named type-<name>.
  // Line height: 125% for headings, 145% for running text, rounded down to whole pixels
  // (16 / 23, 14 / 20, 12 / 17, 10 / 14) and kept in rem so it scales with the text.
  const TYPE = {
    display: { fontSize: "3rem", lineHeight: "1.25", fontWeight: "700" },
    heading: { fontSize: "1.25rem", lineHeight: "1.25", fontWeight: "700" },
    "mode-label": { fontSize: "1.25rem", lineHeight: "1.25", fontWeight: "700", letterSpacing: "0.025em" },
    button: { fontSize: "1rem", lineHeight: "1.4375rem", fontWeight: "500" },
    control: { fontSize: "0.875rem", lineHeight: "1.25rem", fontWeight: "500" },
    body: { fontSize: "0.875rem", lineHeight: "1.25rem", fontWeight: "400" },
    caption: { fontSize: "0.75rem", lineHeight: "1.0625rem", fontWeight: "400" },
    credit: { fontSize: "0.625rem", lineHeight: "0.875rem", fontWeight: "400" },
    // not a text style: the size of emoji used as icons
    emoji: { fontSize: "1.875rem", lineHeight: "1" },
  };

  // Tailwind plugin that turns TYPE into .type-* classes. They go in the components layer, so a
  // leading-* utility on the same element can still override the line height.
  const typePlugin = ({ addComponents }) =>
    addComponents(Object.fromEntries(Object.entries(TYPE).map(([name, css]) => [`.type-${name}`, css])));

  const TOKENS = { PALETTE, MODE_COLORS, THEME, TYPE, typePlugin };
  // Always set the global: Storybook's production build bundles this file as a CommonJS module,
  // where `module` exists too, and its stories read the global.
  root.DESIGN_TOKENS = TOKENS;
  if (typeof module === "object" && module.exports) module.exports = TOKENS;
})(typeof globalThis !== "undefined" ? globalThis : this);
