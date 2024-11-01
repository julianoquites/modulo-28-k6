import http from "k6/http";
import Utils from "../utils/utils.js";
import { check } from "k6";

export default class User {
  list(token) {
    let response = http.get(`${Utils.getBaseUrl()}/users`, { headers: { Authorization: `Bearer ${token}` } });
    check(response, {
      "status deve ser 200": (r) => r.status === 200,
    });
  }


}
