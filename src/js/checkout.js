
import {
  getLocalStorage,
  setLocalStorage,
  alertMessage,
} from "./utils.mjs";

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

    const zip = checkoutForm.elements.zip.value.trim();

    if (!zip) {
      alertMessage("Please enter your zip code.");
      return;
    }

    try {
      const response = await checkout.checkout(checkoutForm);

      console.log("Order response:", response);

      setLocalStorage(CART_KEY, []);

      window.location.href = "./success.html";

    } catch (error) {
      console.error("Checkout error:", error);

      const errorMessage =
        typeof error.message === "string"
          ? error.message
          : JSON.stringify(error.message);

      alertMessage("Checkout error: " + errorMessage);
    }
  });
}
