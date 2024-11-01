import { group } from "k6";
import Login from "../request/login.request.js";
import User from "../request/user.request.js";
import Customer from "../request/customer.request.js";
import Products from "../request/product.request.js";
import data from "../data/usuarios.json";

export const options = {
  stages: [
    { duration: "10s", target: 10 },
    { duration: "5s", target: 50 },
    { duration: "10s", target: 10 },
    { duration: "5s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(99) < 1000"],
  },
};

let productId;
let customerId; // Variável global para armazenar o ID do cliente

export default function () {
  const login = new Login();
  const user = new User();
  const customer = new Customer();
  const products = new Products();

  group("login and get token", () => {
    login.access(data.admin.user, data.admin.pass);
  });

  group("get users", () => {
    user.list(login.getToken());
  });

  group("create customer", () => {
    const newCustomerData = {
      email: "example@example.com",
      firstName: "John",
      lastName: "Doe",
      phone: "1234567890",
    };

    const response = customer.create(login.getToken(), newCustomerData);
    customerId = response.json().id; // Armazena o ID do cliente criado
  });

  group("get customers", () => {
    const response = customer.list(login.getToken());

    const customers = response.json();
    if (customers.length > 0) {
      customerId = customers[0].id; // Armazena o ID do primeiro cliente
    } else {
      console.error("Nenhum cliente encontrado.");
    }
  });

  group("get customer by id", () => {
    if (customerId) {
      customer.getById(login.getToken(), customerId);
    } else {
      console.error(
        "Customer ID não encontrado. Verifique a resposta do teste 'get customers'."
      );
    }
  });

  group("edit customer", () => {
    if (customerId) {
      const updatedCustomerData = {
        firstName: "Jane",
        lastName: "Doe",
        phone: "9876543210",
      };
      customer.editCustomer(login.getToken(), customerId, updatedCustomerData);
    } else {
      console.error(
        "Customer ID não encontrado. Verifique a resposta do teste 'get customers'."
      );
    }
  });

  group("delete customer", () => {
    const newCustomerData = {
      email: "example@example.com",
      firstName: "John",
      lastName: "Doe",
      phone: "1234567890",
    };

    const response = customer.create(login.getToken(), newCustomerData);
    customerId = response.json().id;
    if (customerId) {
      customer.deleteCustomer(login.getToken(), customerId);
      customerId = null;
    } else {
      console.error(
        "Customer ID não encontrado. Verifique a resposta do teste 'get customers'."
      );
    }
  });

  group("create product", () => {
    const newProductData = {
      description: "Description of Product",
      itemPrice: 100,
      name: "Mouse",
    };

    const response = products.create(login.getToken(), newProductData);
    productId = response.json().id; // Armazena o ID do produto criado
  });

  group("get products", () => {
    products.list(login.getToken());
  });

  group("get product by id", () => {
    if (productId) {
      products.getById(login.getToken(), productId);
    } else {
      console.error(
        "Product ID não encontrado. Verifique a resposta do teste 'create product'."
      );
    }
  });

  group("edit product", () => {
    if (productId) {
      const updatedProductData = {
        description: "Updated description",
        itemPrice: 150,
        name: "Updated Mouse",
      };
      products.editProduct(login.getToken(), productId, updatedProductData);
    } else {
      console.error(
        "Product ID não encontrado. Verifique a resposta do teste 'get products'."
      );
    }
  });

  group("delete product", () => {
    if (productId) {
      products.deleteProduct(login.getToken(), productId);
      productId = null;
    } else {
      console.error(
        "Product ID não encontrado. Verifique a resposta do teste 'get products'."
      );
    }
  });
}
