
// Select an element from the document
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// Save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Get data from local storage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// Set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });

  qs(selector).addEventListener("click", callback);
}

// Get a parameter from the URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// Render a list using a template function
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (clear) {
    parentElement.innerHTML = "";
  }

  const htmlString = list.map(templateFn).join("");
  parentElement.insertAdjacentHTML(position, htmlString);
}
// Load an HTML template from a file
export async function loadTemplate(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Could not load template: ${path}`);
  }

  return await response.text();
}

// Render a template into a parent element
export function renderWithTemplate(
  template,
  parentElement,
  data,
  callback
) {
  parentElement.innerHTML = template;

  if (callback) {
    callback(data);
  }
}

// Load the shared header and footer
export async function loadHeaderFooter() {
  const base = import.meta.env.BASE_URL;

  const headerElement = document.querySelector("header");
  const footerElement = document.querySelector("footer");

  const headerTemplate = await loadTemplate(
    `${base}partials/header.html`
  );

  const footerTemplate = await loadTemplate(
    `${base}partials/footer.html`
  );

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}