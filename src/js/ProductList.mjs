import { renderListWithTemplate } from "./utils.mjs";

const FAVORITES_KEY = "sleepOutside:favorites";

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const products = await this.dataSource.getData();
    this.renderList(products);

    this.listElement.addEventListener("click", (event) => {
      const button = event.target.closest(".favorite-button");

      if (!button) return;

      event.preventDefault();
      event.stopPropagation();

      const productId = button.dataset.productId;
      const favorites = JSON.parse(
        localStorage.getItem(FAVORITES_KEY) || "[]"
      );

      const index = favorites.indexOf(productId);

      if (index === -1) {
        favorites.push(productId);
      } else {
        favorites.splice(index, 1);
      }

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));

      const isFavorite = favorites.includes(productId);

      button.textContent = isFavorite ? "♥" : "♡";
      button.classList.toggle("is-favorite", isFavorite);
      button.setAttribute(
        "aria-label",
        isFavorite ? "Remove from favorites" : "Add to favorites"
      );
    });
  }

  renderList(list) {
    renderListWithTemplate(
      this.productCardTemplate,
      this.listElement,
      list,
      "afterbegin",
      true
    );
  }

  productCardTemplate(product) {
    const favorites = JSON.parse(
      localStorage.getItem(FAVORITES_KEY) || "[]"
    );

    const isFavorite = favorites.includes(product.Id);

    return `
      <li class="product-card">
        <button
          type="button"
          class="favorite-button ${isFavorite ? "is-favorite" : ""}"
          data-product-id="${product.Id}"
          aria-label="${isFavorite ? "Remove from favorites" : "Add to favorites"}"
          aria-pressed="${isFavorite}"
        >${isFavorite ? "♥" : "♡"}</button>

        <a href="/product_pages/index.html?product=${product.Id}">
          <img
            src="${product.Image.replace("../images/", "/images/")}" onerror="this.onerror=null; this.src='/images/tents/marmot-ajax-tent-3-person-3-season-in-pale-pumpkin-terracotta~p~880rr_01~320.jpg';"
            alt="${product.Name}"
          />
          <h3>${product.Brand.Name}</h3>
          <h2>${product.NameWithoutBrand}</h2>
        </a>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </li>
    `;
  }
}
