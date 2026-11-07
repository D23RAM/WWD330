
function convertToJson(response) {
  if (!response.ok) {
    throw new Error(`Failed to load products: ${response.status}`);
  }

  return response.json();
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `${import.meta.env.BASE_URL}json/${this.category}.json`;
  }

  async getData() {
    return fetch(this.path).then(convertToJson);
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find((product) => product.Id === id);
  }
}

