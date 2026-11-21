
const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(response) {
  const jsonResponse = await response.json();

  if (!response.ok) {
    throw {
      name: "servicesError",
      message: jsonResponse,
    };
  }

  return jsonResponse;
}

export default class ExternalServices {
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(
      "https://wdd330-backend-osp8.onrender.com/checkout",
      options
    );

    return convertToJson(response);
  }
}
