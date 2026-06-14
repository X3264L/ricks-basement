import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#07090d",
        pixelInk: "#17131b",
        pixelMint: "#86efac",
        hazard: "#ffbd4a",
        breach: "#ff4d6d",
        ion: "#6ea8fe",
        phosphor: "#b6ff6a"
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        pixel: "6px 6px 0 #0a0a0a",
        breach: "0 0 32px rgba(255, 77, 109, 0.34)"
      }
    }
  },
  plugins: []
};

export default config;
