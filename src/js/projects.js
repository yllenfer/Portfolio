import { loadHeaderFooter, resetMenuState, setupHamburgerMenu} from "./utils.mjs";
import { initFunEffects } from "./fun-effects.js";

async function initialize() {
    await loadHeaderFooter();
    setupHamburgerMenu();
    resetMenuState();
}

initialize();

window.addEventListener('load', function() {
    var loadingDiv = document.getElementById('loading-div');
    loadingDiv.style.display = 'none';
    initFunEffects();
});
  