// customer.request.js
import Utils from "../utils/utils.js";
import http from "k6/http";
import { check } from "k6";

export default class Customer {
  list(token) {
    let response = http.get(`${Utils.getBaseUrl()}/customers`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    check(response, {
      "status deve ser 200": (r) => r.status === 200,
    });
    return response;
  }

  create(token, customerData) {
    let response = http.post(
      `${Utils.getBaseUrl()}/customers`,
      JSON.stringify(customerData),
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

  getById(token, customerId) {
    let response = http.get(`${Utils.getBaseUrl()}/customers/${customerId}`, {
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

  editCustomer(token, customerId, customerData) {
    let response = http.patch(
      `${Utils.getBaseUrl()}/customers/${customerId}`,
      JSON.stringify(customerData),
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

  deleteCustomer(token, customerId) {
    const url = `${Utils.getBaseUrl()}/customers/${customerId}`;
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    // Chame http.del sem um corpo ou com um objeto vazio como segundo parâmetro
    let response = http.del(url, {}, params); // O corpo é um objeto vazio

    check(response, { "status deve ser 200": (r) => r.status === 200 });

    return response;
  }
}
