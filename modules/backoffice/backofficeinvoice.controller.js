const BackofficeInvoiceService = require("./backofficeinvoice.service");
const fs = require('fs');
const path = require('path');

class BackofficeInvoiceController {
  // #backofficeInvoiceService
  constructor() {
    // this.#backofficeInvoiceService = new BackofficeInvoiceService();
  };

  async getOrderInvoice(req, res) {
    let { path_to_fv, buffer } = await BackofficeInvoiceService.getInvoiceForOrder();
    // res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(path.basename(path_to_fv))}`);
    res.contentType('application/pdf').send(buffer);
  };
};

const backofficeInvoiceController = new BackofficeInvoiceController();

module.exports = backofficeInvoiceController;