import { loadHeaderFooter, resetMenuState, setupHamburgerMenu} from "./utils.mjs";

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
  

  document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const apiUrl = '/.netlify/functions/send-email';
    console.log('this is the api',apiUrl);

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        this.reset();
        const messageDiv = document.getElementById('message');
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    })
    .catch(error => console.error('Error:', error));
    
});
