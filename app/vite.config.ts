import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/living-ice-temperature/",
  plugins: [react()],
});
