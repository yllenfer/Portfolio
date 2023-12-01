import { resolve } from "path";
import { defineConfig } from "vite";
export default {
    build: {
      rollupOptions: {
        input: 'vite-project/main.js', // Change this to your entry file
      },
    },
    server: {
      port: 5173, // Change the port number as needed
    },
  };
  