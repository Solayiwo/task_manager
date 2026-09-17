import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@styles": resolve(__dirname, "src/assets/styles"),
      "@components": resolve(__dirname, "src/components"),
    },
  },
})
