const BackofficeInvoiceService = require("./backofficeinvoice.service");
const fs = require('fs');
const path = require('path');

class BackofficeInvoiceController {
  // #backofficeInvoiceService
  constructor() {
    // this.#backofficeInvoiceService = new BackofficeInvoiceService();
  };

  async getOrderInvoice(req, res) {
    let filePath = await BackofficeInvoiceService.getInvoiceForOrder(3);
    
    const stream = fs.createReadStream(filePath);

    // res.writeHead(200, {
    //   'Content-type': 'application/pdf',
    //   'Content-disposition': 'attachment; filename="' + encodeURIComponent(path.basename(filePath))  + '"',
    // });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(path.basename(filePath))}`);

    // res.send(data)

    stream.pipe(res);
  };
};

const backofficeInvoiceController = new BackofficeInvoiceController();

module.exports = backofficeInvoiceController;