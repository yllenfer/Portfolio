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
  

  function rotateImages() {
    const skillsDiv = document.querySelector('.skills');
    const firstImage = skillsDiv.querySelector('img:first-child');
    skillsDiv.appendChild(firstImage.cloneNode(true)); 
    firstImage.remove(); 
    console.log(window.screen.height, window.screen.width);

    const images = skillsDiv.querySelectorAll('img');
    const imageWidthWithMargin = firstImage.offsetWidth + 20; 
    images.forEach((img, index) => {
      img.style.transform = `translateX(-${imageWidthWithMargin * index}px)`;
    });
  }
  
  // Rotate images every 3 seconds (3000 milliseconds)
  setInterval(rotateImages, 3000);


  // console.log(window.screen.height, window.screen.width);

  
  