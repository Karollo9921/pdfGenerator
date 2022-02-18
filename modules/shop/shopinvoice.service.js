// const { sequelize, OrderInvoiceComplete } = require("../../database/models");
const generatePdf = require("../../utils/makeFV");

class ShopInvoiceService {
  async getInvoiceForOrder(order_uuid) {
    // return await sequelize.transaction((t) => {
    //   const orderData = await OrderInvoiceComplete.findOne({ where: { order_uuid }, transaction: t });

    //   generatePdf(orderData);
    // });
  };
};

module.exports = ShopInvoiceService;