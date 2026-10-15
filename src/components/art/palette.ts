/** Illustration palette — mirrors the CSS tokens so SVG art stays on-brand. */
export const C = {
  ink: "#141210",
  paper: "#f3eee4",
  paper2: "#ebe4d5",
  paper3: "#e0d7c4",
  cobalt: "#2340e6",
  cobaltDeep: "#172bb0",
  orange: "#ff5a1f",
  lavender: "#c8b6f2",
  lavSoft: "#e4dbf8",
  lime: "#d9f24f",
  limeSoft: "#ecf8a8",
  orangeSoft: "#ff8a5c",
} as const;

export const mono = { fontFamily: "var(--font-mono)", letterSpacing: "0.08em" } as const;
export const serif = { fontFamily: "var(--font-serif)", fontStyle: "italic" } as const;
export const display = { fontFamily: "var(--font-sans)", fontWeight: 800, fontStretch: "75%" } as const;
export const hand = { fontFamily: "var(--font-hand)" } as const;
