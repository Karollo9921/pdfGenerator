const fs = require("fs");
const Pdfmake  = require("pdfmake");
const path = require('path');

const pathWithPDF = __dirname;

const fake_data = [
  {
    seller: {
      name: "Company Name SP. Z O. O.",
      NIP: "99999999",
      address: "Street 195, XX-XXX City",
      email: "email@company.com",
      bank: "Bank Bank SA",
      account_number: "22 2222 2222 2222 2222 2222 2222",
      swift_bic: "BANKBKPL",
    },
    buyer: {
      name: "Name Surname",
      address: "Street 8, XX-XXX City",
    },
    order_details: {
      invoice_number_place: "Wrocław",
      completed_order_datetime: "23-10-2021",
      invoice_prefix: "GNX",
      invoice_number: "18",
      invoice_month: "11",
      invoice_year: "2021",
    },
  },
];

function generatePDF(data, pathWithPDF) {
  return new Promise((resolve, reject) => {
    var fonts = {
      Roboto: {
        normal: pathWithPDF + '/fonts/roboto.regular.ttf',
        bold: pathWithPDF + '/fonts/roboto.medium.ttf',
        italics: pathWithPDF + '/fonts/roboto.italic.ttf',
        bolditalics: pathWithPDF + '/fonts/roboto.medium-italic.ttf'
      }
    }
        
    const createSellerAndBuyerData = (object) => {
      return Object.entries(object).map(([key, value]) => {
        switch (key) {
          case "NIP":
            return { text: `NIP: ${value}` };
          case "email":
            return { text: `E-mail: ${value}` };
          case "bank":
            return { text: `Bank: ${value}` };
          case "account_number":
            return { text: `Nr Konta: ${value}` };
          case "swift_bic":
            return { text: `Nr SWIFT/BIC: ${value}` };
          default:
            return { text: value };
        }
      });
    };

    data.forEach(({ seller, buyer, order_details }) => {
      const { invoice_number_place, completed_order_datetime, invoice_prefix, invoice_number, invoice_month, invoice_year } = order_details;
      // console.log(fs.existsSync(path.join(pathWithPDF, "invoices", `Fv_${invoice_prefix}_${invoice_number}_${invoice_month}_${invoice_year}.pdf`)));
      // 1. Create pdf instance
      const printer = new Pdfmake(fonts);
      // 2. Creare doc definition
      const docDefinition = {
        pageMargins: [40, 80, 40, 60],
        pageSize: "A4",
        watermark: { text: "GetnowX", color: "#54b23e", opacity: 0.1, bold: true, italics: false },
        header: {
          columns: [
            { image: pathWithPDF + "/logo.png", width: 150, margin: [20, 25, 0, 0] },
            {
              stack: [`Miejsce Wystawienia: ${invoice_number_place}`, `Data Wystawienia: ${completed_order_datetime}`, `Data Sprzedaży: ${completed_order_datetime}`],
              alignment: "right",
              margin: [0, 15, 40, 0],
            },
          ],
        },
        footer: {
          columns: ["Left part", { text: "Right part", alignment: "right" }],
        },
        content: [
          { margin: [0, 0, 0, 10], text: `Faktura nr: ${invoice_prefix}/${invoice_number}/${invoice_month}/${invoice_year}`, style: "subHeader" },
          {
            alignment: "justify",
            columnGap: 20,
            columns: [
              {
                stack: [{ text: `Sprzedawca`, fontSize: 16, margin: [15, 0, 0, 5] }, ...createSellerAndBuyerData(seller)],
              },
              {
                stack: [{ text: `Kupujący`, fontSize: 16, margin: [15, 0, 0, 5] }, ...createSellerAndBuyerData(buyer)],
              },
            ],
          },
        ],
        styles: {
          subHeader: {
            fontSize: 18,
            decoration: "underline",
            bold: true,
            margin: [0, 0, 0, 10],
          },
          anotherStyle: {
            italics: true,
            alignment: "right",
          },
        },
      };
      // 3. Options
      const options = {
        //...
      };
      // 4. Create Read Stram
      const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
      const path_to_fv = path.join(pathWithPDF, "invoices", `Fv_${invoice_prefix}_${invoice_number}_${invoice_month}_${invoice_year}.pdf`);
      // 5. Read to write
      pdfDoc.pipe(fs.createWriteStream(path_to_fv));
      // 6. End
      pdfDoc.end();
      resolve(path_to_fv);
    });
  })
};


// triggerPDFGeneratir = async (data, pathWithPDF) => {
//   try {
//     await generatePDF(data, pathWithPDF)
//   } catch (error) {
//     console.log(error)
//   };
// };

// triggerPDFGeneratir(fake_data, pathWithPDF)

module.exports = { generatePDF, fake_data, pathWithPDF };
