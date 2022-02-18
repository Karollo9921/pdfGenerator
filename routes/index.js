const BackofficeInvoiceRoutes = require("./backoffice/backoifficeinvoice.route");
const ShopInvoiceRoutes = require("./shop/shopinvoice.route");

class ApiRoutes {
  #routes = [new BackofficeInvoiceRoutes(), new ShopInvoiceRoutes()];
  router = require("express").Router();

  constructor() {
    this.#initializeRoutes();
  };

  #initializeRoutes() {
    this.#routes.forEach(({ domain, router }) => {
      this.router.use(`${domain}`, router);
    });
  };
};

module.exports = ApiRoutes;