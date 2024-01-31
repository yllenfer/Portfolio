import { loadHeaderFooter, resetMenuState, setupHamburgerMenu } from "./utils.mjs";

async function initialize() {
    await loadHeaderFooter();
    setupHamburgerMenu();
    resetMenuState(); 
}


initialize();

window.addEventListener('load', function() {
    var loadingDiv = document.getElementById('loading-div');
    loadingDiv.style.display = 'none';
  });
  
