import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

document.getElementById('hamburger').addEventListener('click', function() {
    this.classList.toggle('active');
    document.getElementById('nav-links').classList.toggle('open');
});
