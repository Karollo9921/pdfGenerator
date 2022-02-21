const BackofficeInvoiceService = require("./backofficeinvoice.service");
const fs = require('fs');
const path = require('path');

class BackofficeInvoiceController {
  // #backofficeInvoiceService
  constructor() {
    // this.#backofficeInvoiceService = new BackofficeInvoiceService();
  };

  async getOrderInvoice(req, res) {
    let { path_to_fv, memoryBlock } = await BackofficeInvoiceService.getInvoiceForOrder();
    
    memoryBlock.on('finish', async () => {
      const stream = fs.createReadStream(path_to_fv);
   
      res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(path.basename(path_to_fv))}`);
      res.setHeader('Content-Type', 'application/pdf');
       
      stream.pipe(res);
    });
  };
};

const backofficeInvoiceController = new BackofficeInvoiceController();

module.exports = backofficeInvoiceController;