
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const CART_KEY = "so-cart";

function renderCartContents() {
  const cartItems = getLocalStorage(CART_KEY) || [];
  const listElement = document.querySelector(".product-list");

  if (cartItems.length === 0) {
    listElement.innerHTML = "<li>Your cart is empty.</li>";
    document.querySelector(".cart-summary")?.remove();
    return;
  }

  listElement.innerHTML = cartItems.map(cartItemTemplate).join("");

  const total = cartItems.reduce(
    (sum, item) => sum + item.FinalPrice * (item.Quantity || 1),
    0
  );

  let summary = document.querySelector(".cart-summary");

  if (!summary) {
    summary = document.createElement("div");
    summary.className = "cart-summary";
    listElement.after(summary);
  }

  summary.innerHTML = `
    <h2>Order Summary</h2>
    <p><strong>Total: $${total.toFixed(2)}</strong></p>
    <a href="${import.meta.env.BASE_URL}checkout/index.html">
      <button type="button">Proceed to Checkout</button>
    </a>
  `;
}

function cartItemTemplate(item, index) {
  const productName = `${item.Brand?.Name || ""} ${item.NameWithoutBrand || item.Name}`.trim();
  const imageUrl = item.Images?.PrimaryMedium || item.Image || "";
  const color = item.Colors?.[0]?.ColorName || "No color specified";
  const quantity = item.Quantity || 1;

  return `
    <li class="cart-card divider">
      <img src="${imageUrl}" alt="${productName}" />

      <h2>${productName}</h2>
      <p>${color}</p>
      <p>$${item.FinalPrice} each</p>

      <div class="quantity-controls">
        <button type="button" data-action="decrease" data-index="${index}">−</button>
        <span>${quantity}</span>
        <button type="button" data-action="increase" data-index="${index}">+</button>
      </div>

      <button type="button" data-action="remove" data-index="${index}">
        Remove
      </button>

      <p>Subtotal: $${(item.FinalPrice * quantity).toFixed(2)}</p>
    </li>
  `;
}

document.querySelector(".product-list").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const cartItems = getLocalStorage(CART_KEY) || [];
  const index = Number(button.dataset.index);
  const action = button.dataset.action;

  if (!cartItems[index]) return;

  if (action === "increase") {
    cartItems[index].Quantity = (cartItems[index].Quantity || 1) + 1;
  }

  if (action === "decrease") {
    cartItems[index].Quantity = (cartItems[index].Quantity || 1) - 1;

    if (cartItems[index].Quantity <= 0) {
      cartItems.splice(index, 1);
    }
  }

  if (action === "remove") {
    cartItems.splice(index, 1);
  }

  setLocalStorage(CART_KEY, cartItems);
  renderCartContents();
});

renderCartContents();
