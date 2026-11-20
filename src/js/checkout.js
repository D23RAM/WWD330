
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

    const zip = checkoutForm.elements.zip.value.trim();

    if (!zip) {
      alert("Please enter your zip code.");
      return;
    }

    try {
      const response = await checkout.checkout(checkoutForm);

      console.log("Order response:", response);

      alert("Your order was submitted successfully!");

      setLocalStorage(CART_KEY, []);

      summary.innerHTML = `
        <h2>Thank you for your order!</h2>
        <p>Your order has been submitted successfully.</p>
        <a href="../index.html">Continue Shopping</a>
      `;

      checkoutForm.style.display = "none";

    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout error: " + error.message);
    }
  });
}
