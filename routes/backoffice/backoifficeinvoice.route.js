const backofficeInvoiceController = require("../../modules/backoffice/backofficeinvoice.controller");

class BackofficeInvoiceRoutes {
  router = require("express").Router();
  domain = "/backoffice";

  constructor() {
    this.#initializeRoutes();
  };

  #initializeRoutes() {
    this.router.get('/order-invoice', backofficeInvoiceController.getOrderInvoice);
  };
};

module.exports = BackofficeInvoiceRoutes;