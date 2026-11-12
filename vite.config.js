import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        addProduct: resolve(__dirname, "add-product.html"),
        login: resolve(__dirname, "login.html"),
        productDetail: resolve(__dirname, "product-detail.html"),
        profile: resolve(__dirname, "profile.html"),
        register: resolve(__dirname, "register.html"),
      },
    },
  },
});