
import {
  getLocalStorage,
  formDataToJSON,
} from "./utils.mjs";

import ExternalServices from "./ExternalServices.mjs";

const CART_KEY = "so-cart";

export default class CheckoutProcess {
  constructor(form, summary) {
    this.form = form;
    this.summary = summary;
    this.cart = getLocalStorage(CART_KEY) || [];

    this.externalServices = new ExternalServices();

    this.subtotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.orderTotal = 0;

    this.calculateItemSummary();

    this.form.elements.zip.addEventListener("input", () => {
      if (this.form.elements.zip.value.trim() !== "") {
        this.calculateOrderTotals();
      }
    });
  }

  calculateItemSummary() {
    this.subtotal = this.cart.reduce(
      (sum, item) =>
        sum + item.FinalPrice * (item.Quantity || 1),
      0
    );

    this.displayOrderSummary();
  }

  calculateOrderTotals() {
    const itemCount = this.cart.reduce(
      (sum, item) => sum + (item.Quantity || 1),
      0
    );

    this.tax = this.subtotal * 0.06;

    this.shipping =
      itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;

    this.orderTotal = this.subtotal + this.tax + this.shipping;

    this.displayOrderSummary();
  }

  displayOrderSummary() {
    this.summary.innerHTML = `
      <h3>Order Summary</h3>
      <p>Subtotal: $${this.subtotal.toFixed(2)}</p>
      <p>Tax (6%): $${this.tax.toFixed(2)}</p>
      <p>Shipping: $${this.shipping.toFixed(2)}</p>
      <hr>
      <h3>Order Total: $${this.orderTotal.toFixed(2)}</h3>
    `;
  }

  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name: `${item.Brand?.Name || ""} ${item.NameWithoutBrand || item.Name}`.trim(),
      price: item.FinalPrice,
      quantity: item.Quantity || 1,
    }));
  }

  async checkout(form) {
    this.calculateOrderTotals();

    const order = formDataToJSON(form);

    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal.toFixed(2);
    order.shipping = this.shipping;
    order.tax = this.tax.toFixed(2);
    order.items = this.packageItems(this.cart);

    return await this.externalServices.checkout(order);
  }
}
