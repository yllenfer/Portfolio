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
  
  