
import { qs, getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);

    this.renderProductDetails();

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));
  }

  addToCart() {
    let cart = getLocalStorage("so-cart") || [];
    cart.push(this.product);
    setLocalStorage("so-cart", cart);
  }

  renderProductDetails() {
    qs(".product__brand").textContent = this.product.Brand.Name;
    qs(".product__name").textContent = this.product.Name;
   qs(".product__image").src = this.product.Image.replace(
  "../images/",
  "/images/"
);
    qs(".product__image").alt = this.product.Name;
    qs(".product-card__price").textContent = `$${this.product.FinalPrice}`;
    qs(".product__color").textContent = this.product.Colors[0].ColorName;
    qs(".product__description").innerHTML = this.product.DescriptionHtmlSimple;
  }
}
