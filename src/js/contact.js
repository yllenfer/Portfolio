import { loadHeaderFooter, resetMenuState, setupHamburgerMenu } from "./utils.mjs";

async function initialize() {
    await loadHeaderFooter();
    setupHamburgerMenu();
    resetMenuState();
}

initialize();

window.addEventListener('load', function () {
    var loadingDiv = document.getElementById('loading-div');
    loadingDiv.style.display = 'none';
});

document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('fname').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const validationMessage = document.getElementById('validation-error');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !subject) {
        validationMessage.textContent = 'Please fill in all fields';
        validationMessage.classList.remove('hidden');
        setTimeout(() => {
            validationMessage.textContent = ''; 
            validationMessage.classList.add('hidden');
        }, 2000);
        return;
    }

    if (!emailRegex.test(email)) {
        
        validationMessage.textContent = 'Please enter a valid email address';
        setTimeout(() => {
            validationMessage.textContent = ''; 
        }, 2000);
        return;
    }

    validationMessage.textContent = '';

    const formData = new FormData(this);
    const apiUrl = '/.netlify/functions/send-email';
    console.log('this is the api', apiUrl);

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
