const ShopInvoiceService = require("./shopinvoice.service");
const fs = require('fs');
const path = require('path');

class ShopInvoiceController {
  // #ShopInvoiceService
  constructor() {
    // this.#ShopInvoiceService = new ShopInvoiceService();
  };

  async getOrderInvoice(req, res) {
    let { path_to_fv, memoryBlock } = await ShopInvoiceService.getInvoiceForOrder();
    
    memoryBlock.on('finish', async () => {
      const stream = fs.createReadStream(path_to_fv);
   
      res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(path.basename(path_to_fv))}`);
      res.setHeader('Content-Type', 'application/pdf');
       
      stream.pipe(res);
    });
  };
};

const shopInvoiceController = new ShopInvoiceController();

module.exports = shopInvoiceController;