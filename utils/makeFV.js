const fs = require("fs");
const Pdfmake  = require("pdfmake");
const path = require('path');

const pathWithPDF = __dirname;
const formatterPLN = new Intl.NumberFormat('pl', { style: 'currency', currency: 'PLN', minimumFractionDigits: 2 });

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
    article_or_service_details: [
      {
        "Nazwa towaru/usługi": "Abcdef",
        "ilość": "1",
        "Cena netto": "111209",
        VAT: "5%",
        "Kwota netto": "111409",
        "Kwota VAT": "11110",
        "Kwota brutto": "111219",
        "Kwota netto po upuście": "111409",
        "Kwota VAT po upuście": "11110",
        "Kwota brutto po upuście": "111219"
      },
      {
        "Nazwa towaru/usługi": "Ghijkl",
        "ilość": "3",
        "Cena netto": "111329",
        VAT: "4%",
        "Kwota netto": "111109",
        "Kwota VAT": "010",
        "Kwota brutto": "111219",
        "Kwota netto po upuście": "111209",
        "Kwota VAT po upuście": "11010",
        "Kwota brutto po upuście": "111219"
      },
      {
        "Nazwa towaru/usługi": "Mnopqrst",
        "ilość": "2",
        "Cena netto": "111209",
        VAT: "5%",
        "Kwota netto": "111209",
        "Kwota VAT": "11010",
        "Kwota brutto": "111219",
        "Kwota netto po upuście": "111209",
        "Kwota VAT po upuście": "11110",
        "Kwota brutto po upuście": "111219"
      },
    ],
    payment_details: {
      "Sposób płatności": "Bank Pekao SA",
      "Termin płatności": "Zapłacono 2021-03-03",
      "ID płatności": "6666-ffff-gggg-hhhh-13asaas453",
      "Zniżka": "0"
    }
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
            return { text: [ 'NIP: ', { text: value, bold: true } ] };
          case "email":
            return { text: [ 'E-mail: ', { text: value, bold: true } ] };
          case "bank":
            return { text: [ 'Bank: ', { text: value, bold: true } ] };
          case "account_number":
            return { text: [ 'Nr konta: ', { text: value, bold: true } ] };
          case "swift_bic":
            return { text: [ 'Nr SWIFT/BIC: ', { text: value, bold: true } ] };
          default:
            return { text: value, bold: true };
        }
      });
    };

    const createPaymentData = (object) => {
      return Object.entries(object).map(([key, value]) => {
        switch (key) {
          case "Sposób płatności":
            return { text: [ 'Sposób płatności: ', { text: value, bold: true } ], fontSize: 9 };
          case "Termin płatności":
            return { text: [ 'Termin płatności: ', { text: value, bold: true } ], fontSize: 9 };
          case "ID płatności":
            return { text: [ 'ID płatności: ', { text: value, bold: true } ], fontSize: 9 };
          case "Zniżka":
            return { text: [ 'Zniżka: ', { text: formatterPLN.format(value / 100), bold: true } ], fontSize: 9 };
          default:
            return { text: value, bold: true, fontSize: 9 };
        }
      });
    };

    const createTableForArticlesAndServices = (article_or_service_details) => {
      let outputToBuildTable = [];

      // Headers
      outputToBuildTable.push(
        ["lp."]
          .concat(Object.keys(article_or_service_details[0]))
          .map((header) => {
            return { text: header, bold: true, alignment: 'center', fontSize: 10, fillColor: 'grey' }
          })
      );

      // Rows
      article_or_service_details.forEach((article_or_service_detail, index) => {
        outputToBuildTable.push(
          [{ text: (index + 1).toString(), fontSize: 8, alignment: 'center' }]
            .concat(Object.keys(article_or_service_detail)
            .map((key) => {
              let result;
              if (key.toString().toLowerCase().includes('kwota') || key.toString().toLowerCase().includes('cena')) {
                result = { text: formatterPLN.format(article_or_service_detail[key] / 100), fontSize: 8, alignment: 'center' }
              } else {
                result = { text: article_or_service_detail[key], fontSize: 8, alignment: 'center' }
              }
              return result;
            }))
        );
      });

      return outputToBuildTable;
    };

    const createInvoiceSummary = (article_or_service_details) => {
      let outputToBuildSummaryTable = [];
      let headers = ['', 'Netto', 'VAT', 'Brutto'];
      let amountToSum = ['Kwota netto po upuście', 'Kwota VAT po upuście', 'Kwota brutto po upuście']

      // Header
      outputToBuildSummaryTable.push(
        headers.map((header) => { 
          return { text: header, bold: true, alignment: 'center', fontSize: 10, fillColor: 'grey' } 
        })
      );

      // Rows
      let rows = [
        {  text: 'Razem', fontSize: 9, alignment: 'center', bold: true }, 
        '0',  
        '0',  
        '0', 
      ];

      // SUMS
      sumOrderAmountType(article_or_service_details, rows, amountToSum, 0); // NETTO
      sumOrderAmountType(article_or_service_details, rows, amountToSum, 1); // VAT
      sumOrderAmountType(article_or_service_details, rows, amountToSum, 2); // BRUTTO

      outputToBuildSummaryTable.push(rows)

      return outputToBuildSummaryTable;
    };
    
    const sumOrderAmountType = (article_or_service_details, rows, amountToSummArray, amountsPositionInArray) => {
      rows[amountsPositionInArray + 1] = 
        article_or_service_details
          .map((object) => { return parseFloat(object[amountToSummArray[amountsPositionInArray]] / 100) })
          .reduce((kn1, kn2, i) => {
            let result;

            if (kn1.toString().includes('zł')) {
              kn1 = parseFloat(kn1.replace(/ zł/g, '').replace(/,/g, '.'))
            }

            // If last element of Reduce function then we want to return an Object with formating to PDFMake requirments
            if (i + 1 === article_or_service_details.length) {
              result = { text: formatterPLN.format(kn1 + kn2), fontSize: 9, alignment: 'center' }
            } else {
              result = formatterPLN.format(kn1 + kn2)
            }

            return result
        });
    };

    data.forEach(({ seller, buyer, order_details, article_or_service_details, payment_details }) => {
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
          alignment: "center",
          text: ['Zapłacono: ', { text: createInvoiceSummary(article_or_service_details)[1][3].text, bold: true }],
          fontSize: 14
        },
        content: [
          { margin: [0, 0, 0, 10], text: `Faktura nr: ${invoice_prefix}/${invoice_number}/${invoice_month}/${invoice_year}`, style: "subHeader" },
          {
            alignment: "justify",
            columnGap: 20,
            columns: [
              {
                stack: [{ text: `Sprzedawca`, fontSize: 16, style: "subHeader", margin: [15, 0, 0, 5] }, ...createSellerAndBuyerData(seller)],
              },
              {
                stack: [{ text: `Kupujący`, fontSize: 16, style: "subHeader", margin: [15, 0, 0, 5] }, ...createSellerAndBuyerData(buyer)],
              },
            ],
          },
          {
            margin: [0, 30, 0, 30],
            // layout: 'headerLineOnly', // optional
            // style: 'tableExample',
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ 
                'auto', 90, 'auto', 40, 20, 40,
                35, 40, 40, 38, 40
              ],
              body: createTableForArticlesAndServices(article_or_service_details)
            }
          },
          {
            alignment: "justify",
            columnGap: 50,
            columns: [
              {
                stack: [
                  { 
                    text: `Szczegóły płatności:`, 
                    bold: true, 
                    fontSize: 11, 
                    style: "subHeader", 
                    margin: [0, 20, 0, 10] 
                  }, 
                  ...createPaymentData(payment_details)
                ],
              },
              {
                margin: [0, 20, 0, 20],
                // layout: 'headerLineOnly', // optional
                // style: 'tableExample',
                table: {
                  // headers are automatically repeated if the table spans over multiple pages
                  // you can declare how many rows should be treated as headers
                  headerRows: 1,
                  widths: ['auto', 'auto', 'auto', 'auto'],
                  body: createInvoiceSummary(article_or_service_details)
                }
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
      let memoryBlock;
      pdfDoc.pipe(memoryBlock = fs.createWriteStream(path_to_fv));
      // 6. End
      pdfDoc.end();
      resolve({ path_to_fv, memoryBlock });
    });
  })
};


// triggerPDFGenerator = async (data, pathWithPDF) => {
//   try {
//     await generatePDF(data, pathWithPDF)
//   } catch (error) {
//     console.log(error)
//   };
// };

// triggerPDFGenerator(fake_data, pathWithPDF)

module.exports = { generatePDF, fake_data, pathWithPDF };