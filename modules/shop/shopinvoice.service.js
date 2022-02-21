const { generatePDF, fake_data, pathWithPDF } = require("../../utils/makeFV");

class ShopInvoiceService {
  static async getInvoiceForOrder() {
    try {
      return await generatePDF(fake_data, pathWithPDF);
    } catch (error) {
      console.log(error)
    }
  };
};

module.exports = ShopInvoiceService;