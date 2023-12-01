import { resolve } from "path";
import { defineConfig } from "vite";


export default defineConfig({
    root: "src/",
    build: {
      outDir: "../dist",
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/index.html'),
          keto: resolve(__dirname, 'src/diets/keto.html'),
          vegetarian: resolve(__dirname, 'src/diets/vegetarian.html'),
          vegan: resolve(__dirname, 'src/diets/vegan.html'),
          paleo: resolve(__dirname, 'src/diets/paleo.html'),
          recipecontainer: resolve(__dirname, 'src/recipe-display/recipecontainer.html'),
          savedRecipes: resolve(__dirname, 'src/recipe-display/savedrecipes.html'),
        },
      },
    },
    server: {
      base: "/",
    },
  });