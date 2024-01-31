export async function renderWithTemplate(
    templateFn,
    parentElement,
    data,
    callback,
    position = "afterbegin",
    clear = true
  ) {
    if (clear) {
        parentElement.innerHTML = "";
    }
    const htmlString = await templateFn(data); 
    parentElement.insertAdjacentHTML(position, htmlString);
    if (callback) {
        callback(data);
    }
  }
  
  window.onload = () => {
  
  };
  
  
  export function loadTemplate(path) {
      return async function () {
        const res = await fetch(path);
        if (res.ok) {
          const html = await res.text();
          return html;
        }
      };
    }
    
  
    export async function loadHeaderFooter() {
      return new Promise(async (resolve, reject) => {
          try {
              const headerTemplateFn = await loadTemplate("/partials/header.html");
              const footerTemplateFn = await loadTemplate("/partials/footer.html");
              const headerEl = document.querySelector("#main-header");
              const footerEl = document.querySelector("#main-footer");
  
              // Wait for header and footer to be rendered
              await renderWithTemplate(headerTemplateFn, headerEl);
              await renderWithTemplate(footerTemplateFn, footerEl);
  
              resolve(); // Resolve the promise when rendering is done
          } catch (error) {
              console.error('Error loading header or footer:', error);
              reject(error); // Reject the promise in case of an error
          }
      });
  }
  
  
// Resets the menu to its default state
export function resetMenuState() {
    const hamburger = document.getElementById('hamburger-menu');
    const closeIcon = document.getElementById('close-icon');
    const navLinks = document.getElementById('nav-links');

    // Hide the navigation links and the 'X' icon, show the hamburger icon
    navLinks.classList.remove('open');
    hamburger.style.display = 'block';
    closeIcon.style.display = 'none';
}

export function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger-menu');
    const closeIcon = document.getElementById('close-icon');
    const navLinks = document.getElementById('nav-links');

    // Event listener for opening the menu
    hamburger.addEventListener('click', () => {
        navLinks.classList.add('open');
        hamburger.style.display = 'none';
        closeIcon.style.display = 'block';
    });

    // Event listener for closing the menu
    closeIcon.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.style.display = 'block';
        closeIcon.style.display = 'none';
    });
}