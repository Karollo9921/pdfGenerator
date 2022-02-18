const ShopInvoiceService = require("./shopinvoice.service");

class ShopInvoiceController {
  #ShopInvoiceService
  constructor() {
    this.#ShopInvoiceService = new ShopInvoiceService();
  };

  getOrderInvoice() {};
};

const shopInvoiceController = new ShopInvoiceController();

module.exports = shopInvoiceController;