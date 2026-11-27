import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://adrianvo85.github.io",
  base: "/hispanic-society-kamloops",
  trailingSlash: "always",
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
});
