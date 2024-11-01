import Utils from "../utils/utils.js";
import http from "k6/http";
import { check } from "k6";

export default class Products {
  list(token) {
    let response = http.get(`${Utils.getBaseUrl()}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    check(response, {
      "status deve ser 200": (r) => r.status === 200,
    });
    return response;
  }

  create(token, productData) {
    let response = http.post(
      `${Utils.getBaseUrl()}/products`,
      JSON.stringify(productData),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    check(response, {
      "status deve ser 201": (r) => r.status === 201,
    });

    return response;
  }

  getById(token, productId) {
    let response = http.get(`${Utils.getBaseUrl()}/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    check(response, {
      "status deve ser 200": (r) => r.status === 200,
    });

    return response;
  }

  editProduct(token, productId, productData) {
    let response = http.patch(
      `${Utils.getBaseUrl()}/products/${productId}`,
      JSON.stringify(productData),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    check(response, {
      "status deve ser 200": (r) => r.status === 200,
    });

    return response;
  }

  deleteProduct(token, productId) {
    const url = `${Utils.getBaseUrl()}/products/${productId}`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    let response = http.del(url, {}, params);

    check(response, { "status deve ser 200": (r) => r.status === 200 });

    return response;
  }
}
