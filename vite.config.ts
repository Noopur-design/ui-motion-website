import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        // Long-lived vendor chunks cache well across content updates.
        codeSplitting: {
          groups: [
            { name: "react", test: /node_modules[\/](react|react-dom|scheduler)[\/]/ },
            { name: "motion", test: /node_modules[\/](motion|motion-dom|motion-utils|framer-motion)[\/]/ },
            // Morph/Draw plugins stay with the lazily loaded Playground chunk.
            { name: "gsap", test: /node_modules[\/](gsap|@gsap)[\/](?!.*(MorphSVG|DrawSVG))/ },
            { name: "radix", test: /node_modules[\/]@radix-ui[\/]/ },
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
