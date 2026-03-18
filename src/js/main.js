import { loadHeaderFooter, resetMenuState, setupHamburgerMenu } from "./utils.mjs";
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

function rotateImages() {
    const skillsDiv = document.querySelector('.skills');
    if (!skillsDiv) return;
    const firstImage = skillsDiv.querySelector('img:first-child');
    if (!firstImage) return;
    skillsDiv.appendChild(firstImage.cloneNode(true));
    firstImage.remove();

    const images = skillsDiv.querySelectorAll('img');
    const imageWidthWithMargin = firstImage.offsetWidth + 20;
    images.forEach((img, index) => {
      img.style.transform = `translateX(-${imageWidthWithMargin * index}px)`;
    });
}

setInterval(rotateImages, 3000);

  