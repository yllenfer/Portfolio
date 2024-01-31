import { loadHeaderFooter } from "./utils.mjs";

async function initialize() {
    await loadHeaderFooter();
    setupHamburgerMenu();
}

function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });
}

initialize();
