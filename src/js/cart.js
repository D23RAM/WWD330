
import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const listElement = document.querySelector(".product-list");

  if (cartItems.length === 0) {
    listElement.innerHTML = "<li>Your cart is empty.</li>";
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));

  listElement.innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const imagePath = item.Image.replace("../images/", "images/");
  const imageUrl = `${import.meta.env.BASE_URL}${imagePath}`;

  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img
          src="${imageUrl}"
          alt="${item.Name}"
        />
      </a>

      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>

      <p class="cart-card__color">
        ${item.Colors[0].ColorName}
      </p>

      <p class="cart-card__quantity">qty: 1</p>

      <p class="cart-card__price">$${item.FinalPrice}</p>
    </li>
  `;
}

renderCartContents();
