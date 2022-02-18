// const { sequelize, OrderInvoiceComplete } = require("../../database/models");
const { generatePDF, fake_data, pathWithPDF } = require("../../utils/makeFV");

class BackofficeInvoiceService {
  static async getInvoiceForOrder(order_uuid) {
    // return await sequelize.transaction((t) => {
    //   const orderData = await OrderInvoiceComplete.findOne({ where: { order_uuid }, transaction: t });

    try {
      return await generatePDF(fake_data, pathWithPDF);
    } catch (error) {
      console.log(error)
    }
    // });
  };
};

module.exports = BackofficeInvoiceService;