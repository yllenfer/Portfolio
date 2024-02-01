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
  

  document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    fetch('/send-email', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        // Clear the form
        document.getElementById('contact-form').reset();
        // Show success message
        const messageDiv = document.getElementById('message');
        messageDiv.style.display = 'block';
        // Hide the message after a few seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000); // Adjust the time as needed
    })
    .catch(error => console.error('Error:', error));
});
