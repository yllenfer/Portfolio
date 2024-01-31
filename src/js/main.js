import { loadHeaderFooter } from "./utils.mjs";

async function initialize() {
    await loadHeaderFooter();
    // other initialization code
}

function toggleMenu() {
  var x = document.getElementById("nav-links");
  if (x.classList.contains('open')) {
    x.classList.remove('open');
  } else {
    x.classList.add('open');
  }
}

window.toggleMenu = toggleMenu; // Make it globally accessible

console.log(document.getElementById("nav-links"));


initialize();
