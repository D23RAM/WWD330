
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

const CART_KEY = "so-cart";

const checkoutForm = document.querySelector("#checkout-form");
const summary = document.querySelector("#checkout-summary");

const cartItems = getLocalStorage(CART_KEY) || [];

if (cartItems.length === 0) {
  summary.innerHTML = `
    <p>Your cart is empty.</p>
    <a href="../index.html">Continue Shopping</a>
  `;
  checkoutForm.style.display = "none";
} else {
  const checkout = new CheckoutProcess(checkoutForm, summary);

  checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!checkoutForm.reportValidity()) return;

    alert("Order submission will be connected next!");

    setLocalStorage(CART_KEY, []);
  });
}
