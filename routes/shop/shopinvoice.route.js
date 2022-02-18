const shopInvoiceController = require("../../modules/shop/shopinvoice.controller");

class ShopInvoiceRoutes {
  router = require("express").Router();
  domain = "/shop";

  constructor() {
    this.#initializeRoutes();
  };

  #initializeRoutes() {
    this.router.route('/order-invoice/:id').get(shopInvoiceController.getOrderInvoice);
  };
};

module.exports = ShopInvoiceRoutes;