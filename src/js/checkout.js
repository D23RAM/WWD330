
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const CART_KEY = "so-cart";

function displayOrderSummary() {
  const cartItems = getLocalStorage(CART_KEY) || [];
  const summary = document.querySelector("#checkout-summary");

  if (cartItems.length === 0) {
    summary.innerHTML = `
      <p>Your cart is empty.</p>
      <a href="../index.html">Continue Shopping</a>
    `;
    document.querySelector("#checkout-form").style.display = "none";
    return;
  }

  const total = cartItems.reduce(
    (sum, item) =>
      sum + item.FinalPrice * (item.Quantity || 1),
    0
  );

  summary.innerHTML = `
    <h3>Your Order</h3>
    <ul>
      ${cartItems.map((item) => `
        <li>
          ${item.Brand?.Name || ""} ${item.NameWithoutBrand || item.Name}
          - Quantity: ${item.Quantity || 1}
          - $${(item.FinalPrice * (item.Quantity || 1)).toFixed(2)}
        </li>
      `).join("")}
    </ul>
    <h3>Total: $${total.toFixed(2)}</h3>
  `;
}

const checkoutForm = document.querySelector("#checkout-form");

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const cartItems = getLocalStorage(CART_KEY) || [];

  if (cartItems.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert("Thank you! Your order has been placed.");

  setLocalStorage(CART_KEY, []);

  document.querySelector("#checkout-summary").innerHTML = `
    <h2>Thank you for your order!</h2>
    <p>Your order has been submitted successfully.</p>
    <a href="../index.html">Continue Shopping</a>
  `;

  checkoutForm.style.display = "none";
});

displayOrderSummary();
