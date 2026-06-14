import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#07090d",
        glass: "rgba(12, 18, 25, 0.68)",
        reactor: "#42f5c8",
        hazard: "#ffbd4a",
        breach: "#ff4d6d",
        ion: "#6ea8fe",
        phosphor: "#b6ff6a"
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        reactor: "0 0 28px rgba(66, 245, 200, 0.28)",
        breach: "0 0 32px rgba(255, 77, 109, 0.34)"
      }
    }
  },
  plugins: []
};

export default config;
