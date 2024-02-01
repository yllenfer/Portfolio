import { resolve } from "path";
import { defineConfig } from "vite";

// export default {
//   base: process.env.BASE_URL || '/',
// }


export default defineConfig({
    root: "src/",
    build: {
      outDir: "../dist",
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/index.html'),
          contact: resolve(__dirname, 'src/pages/contact.html'),
          resume: resolve(__dirname, 'src/pages/resume.html'),
          projects: resolve(__dirname, 'src/pages/projects.html')
          

       
        },
      },
    },
    server: {
      base: "/",
    },
  });