
const { fetchTable, exeQuery, fetchOptions } = require('../../config')
const JSZip = require("jszip");
const PdfPrinter = require("pdfmake");
const fs = require("fs");


async function stateCodeDetails({ company }) {
    try {
        let stateCode = await fetchTable(`select * from gst_state_code_india`)
        let companyAddressRes = await fetchTable(`select permanentaddress from syf_companyMaster where lid='${company.companyID}'`)
        let address = companyAddressRes.length > 0 ? companyAddressRes[0].permanentaddress : '';
        let getRes = await fetchTable(`select gstin from syf_gstmaster where companyid='${company.companyID}'`)
        let gstin = getRes.length > 0 ? getRes[0].gstin : '';
        let invoiceNumberRes = await fetchTable(`select taxInvoiceNo from tdsInvoices where companyId='${company.companyID}'`)
        let vendorOptionsList = await fetchOptions(`select * from vendorMasterTemp where companyId='${company.companyID}'`, "vendorName", "vendorName")
        let vendorOptions = vendorOptionsList.map((item) => { return item.label })
        return {
            address: address,
            gstin: gstin,
            stateCodeDetails: stateCode,
            invoiceNumber: invoiceNumberRes,
            vendorOptions: vendorOptions
        }
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }

}

async function reportCreation({ company, companyData, stateCodeDetails, lid }) {
    try {
        let fetch = await fetchTable(`select * from tdsInvoices where lid='${lid}'`)
        let data = fetch[0]
        let vendorRes = await fetchTable(`select * from vendorMasterTemp where vendorName='${data.vendorName}' and companyId='${company.companyID}'`)
        let vendorData = vendorRes[0]
        let total = Number(data.amount) + Number(data.igstAmount) + Number(data.cgstAmount) + Number(data.sgstAmount)
        let stateCode;
        let stateName;
        let companyStateCode;
        if (vendorData.gstin.toLowerCase() == 'urp' || vendorData.gstin == "") {
            stateCode = 'UR'
            stateName = 'NA'
        }
        else {
            let gstCode = vendorData.gstin.slice(0, 2)
            let data = stateCodeDetails.filter((item) => {
                if (item.gstcode == gstCode) {
                    return item
                }
            })
            stateCode = data[0].shortform
            stateName = data[0].stateorutname
        }
        if (data.clientGstin == "") {
            companyStateCode = 'UR'
        }
        else {
            let gstCode = data.clientGstin.slice(0, 2)
            let statedata = stateCodeDetails.filter((item) => {
                if (item.gstcode == gstCode) {
                    return item
                }
            })
            if (statedata.length == 0) {
                companyStateCode = 'UR'
            } else {
                companyStateCode = statedata[0].shortform
            }
        }
        let igstHide = data.igstRate == 0 ? 'rcm_hide' : ''
        let cgstHide = data.cgstRate == 0 ? 'rcm_hide' : ''
        if (data.cgstRate == 2) {
            data.cgstRate = 2.5
            data.sgstRate = 2.5

        }
        let content = `
          <div style="background-color:lightblue" class="p-2 rounded">
            <h4><b>${company.companyname}</b></h4>
            <div class="d-flex justify-content-between company-details">
                 <div class="w-50">
        <div><label>GSTIN</label>: <span>${data.clientGstin}</span></div>
        <div><label>Address</label>: <span>${data.clientAddress}</span></div>
        <div><label>State Code</label>: <span>${companyStateCode}</span></div>
        </div>
        <div>
        <div><label>Tax Invoice No</label>: <span id="rcm_invoiceNumber">${data.taxInvoiceNo}</span></div>
        <div><label>Date of Invoice</label>: <span>${formatDate(data.date)}</span></div>
        </div>
        </div>

            
        </div>
        <div class="mt-3">
            <h6><b>Details of Service Provider / Supplier</b></h6>
            <div class="vendor-details">
            <div><label>Name</label>: <span>${vendorData.vendorName}</span></div>
            <div><label>GSTIN</label>: <span>${vendorData.gstin}</span></div>
            <div><label>Address</label>: <span>${vendorData.address}</span></div>
            <div><label>State Name</label>: <span>${vendorData.stateName}</span></div>
            <div><label>State Code</label>: <span>${vendorData.stateCode}</span></div>
            <div><label>Place Of Supply</label>: <span>${data.placeOfSupply}</span></div>
            </div>

        </div>
                    <table class="mt-3" style="table-layout:auto">
                        <thead>
                            <tr>
                                <th>Particulars</th>
                                <th>HSN Code</th>
                                <th>Amount</th>
                                <th  class="${igstHide}">IGST Rate</th>
                                <th  class="${igstHide}">IGST Amount</th>
                                <th  class="${cgstHide}">CGST Rate</th>
                                <th  class="${cgstHide}">CGST Amount</th>
                                <th  class="${cgstHide}">SGST Rate</th>
                                <th  class="${cgstHide}">SGST Amount</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${vendorData.service}</td>
                                <td>${data.hsncode}</td>
                                <td class="right">${formatIndianCurrency(data.amount)}</td>
                                <td class="right ${igstHide}">${data.igstRate}%</td>
                                <td class="right ${igstHide}">${formatIndianCurrency(data.igstAmount)}</td>
                                <td class="right ${cgstHide}">${data.cgstRate}%</td>
                                <td class="right ${cgstHide}">${formatIndianCurrency(data.cgstAmount)}</td>
                                <td class="right ${cgstHide}">${data.sgstRate}%</td>
                                <td class="right ${cgstHide}">${formatIndianCurrency(data.sgstAmount)}</td>
                            </tr>
                           
                            <tr class="total-row">
                                <td colspan="1"><strong>Total</strong></td>
                                <td colspan="1"></td>
                                <td class="right">${formatIndianCurrency(data.amount)}</td>
                                <td class="right ${igstHide}">-</td>
                                <td class="right ${igstHide}">${formatIndianCurrency(data.igstAmount)}</td>
                                <td class="right ${cgstHide}">-</td>
                                <td class="right ${cgstHide}">${formatIndianCurrency(data.cgstAmount)}</td>
                                <td class="right ${cgstHide}">-</td>
                                <td class="right ${cgstHide}">${formatIndianCurrency(data.sgstAmount)}</td>
                            </tr>

                            <tr class="total-row">
                                <td colspan="1"><strong>Total invoice value</strong></td>
                                <td colspan="1"></td>
                                <td colspan="1" class="right"><b>${formatIndianCurrency(total)}</b></td>
                                <td class="${igstHide}"></td>
                                <td class="${igstHide}"></td>
                                <td class="${cgstHide}"></td>
                                <td class="${cgstHide}"></td>
                                <td class="${cgstHide}"></td>
                                <td class="${cgstHide}"></td>
                            </tr>
                             <tr>
                                <td colspan="1"><strong>Amount of Tax liable to RCM</strong></td>
                                <td colspan="1"></td>
                                <td colspan="1"></td>
                                <td class="right ${igstHide}"></td>
                                <td class="right ${igstHide}"><b>${formatIndianCurrency(data.igstAmount)}</b></td>
                                <td class="right ${cgstHide}"></td>
                                <td class="right ${cgstHide}"><b>${formatIndianCurrency(data.cgstAmount)}</b></td>
                                <td class="right ${cgstHide}"></td>
                                <td class="right ${cgstHide}"><b>${formatIndianCurrency(data.sgstAmount)}</b></td>
                            </tr>
                            

                        </tbody>
                    </table>

                    <div class="notes mt-3">
                        <p><strong>Notes:</strong></p>
                        <ol>
                            <li>Special invoice for RCM is raised by our organisation as per section 31(3)(f) of CGST Act, 2017.</li>
                            <li>The amount paid to the supplier is exclusive of GST payable under RCM.</li>
                            <li>This invoice is a computer-generated document and therefore does not require any signature.</li>
                        </ol>
                    </div>`

        return ({ "content": content })
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function bulkReportCreation({ company, companyData, stateCodeDetails, lids }) {
    try {
        let zip = new JSZip();
        let vendorRes = await fetchTable(`select * from vendorMasterTemp where companyId='${company.companyID}'`)
        let lidList = lids.join(',')
        let totalData = await fetchTable(`select * from tdsInvoices where lid IN (${lidList}) and companyId='${company.companyID}'`)
        for (let lid of lids) {
            let data = totalData.find(item => item.lid == lid);
            let vendorData = vendorRes.find(item => item.vendorName == data.vendorName && item.companyId == company.companyID);
            let resData = await getReportForBulk(stateCodeDetails,company, companyData, data,vendorData);
            let pdfBuffer = await createPDF(resData.content) 
            let safeInvoiceNumber = resData.invoiceNumber.replace(/\//g, '-');
            zip.file(`RCM Invoice - ${safeInvoiceNumber}.pdf`, pdfBuffer);
        }

        return zip.generateAsync({ type: "nodebuffer" });
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function deleteData({ lids }) {
    try {
        let del_call = await exeQuery(`DELETE FROM tdsInvoices WHERE lid IN (${lids})`);
        return del_call;
    }
    catch (error) {
        return { error: true, message: error.message, details: error };
    }
}

async function getReportForBulk(stateCodeDetails,company,companyData,totalData,vendor){
    try{
        let data = totalData
        let vendorData = vendor
        let total = Number(data.amount) + Number(data.igstAmount) + Number(data.cgstAmount) + Number(data.sgstAmount)
        let stateCode;
        let stateName;
        let companyStateCode;
        if (
            vendorData.gstin.toLowerCase() === 'urp' ||
            vendorData.gstin === "" ||
            vendorData.gstin.toLowerCase().startsWith('urp')) {
            stateCode = 'UR';
            stateName = 'NA';
        } else {
            let gstCode = vendorData.gstin.slice(0, 2);
            let data = stateCodeDetails.filter((item) => {
                if (item.gstcode == gstCode) {
                    return item;
                }
            });
            if( data.length == 0) {
                stateCode = 'UR';
                stateName = 'NA';
            }
            else{
                 stateCode = data[0].shortform;
                 stateName = data[0].stateorutname;
            }
           
        }
        if (data.clientGstin == "") {
            companyStateCode = 'UR'
        }
        else {
            let gstCode = data.clientGstin.slice(0, 2)
            let statedata = stateCodeDetails.filter((item) => {
                if (item.gstcode == gstCode) {
                    return item
                }
            })
            if (statedata.length == 0) {
                companyStateCode = 'UR'
            }
            else {
                companyStateCode = statedata[0].shortform
            }
        }
        let igstHide = data.igstRate == 0 ? 'rcm_hide' : ''
        let cgstHide = data.cgstRate == 0 ? 'rcm_hide' : ''
        let res = generatePdfContent(company, companyData, companyStateCode, data, vendorData, igstHide, cgstHide, total)
        return res
    }
    catch (e) {
        return { error: true, message: e.message, details: e };
    }
}

async function getReport({ company, companyData, stateCodeDetails, lid }) {
    try {
        let fetch = await fetchTable(`select * from tdsInvoices where lid='${lid}'`)
        let data = fetch[0]
        let vendorRes = await fetchTable(`select * from vendorMasterTemp where vendorName='${data.vendorName}' and companyId='${company.companyID}'`)
        let vendorData = vendorRes[0]
        let total = Number(data.amount) + Number(data.igstAmount) + Number(data.cgstAmount) + Number(data.sgstAmount)
        let stateCode;
        let stateName;
        let companyStateCode;
        if (vendorData.gstin.toLowerCase() == 'urp' || vendorData.gstin == "") {
            stateCode = 'UR'
            stateName = 'NA'
        }
        else {
            let gstCode = vendorData.gstin.slice(0, 2)
            let data = stateCodeDetails.filter((item) => {
                if (item.gstcode == gstCode) {
                    return item
                }
            })
            stateCode = data[0].shortform
            stateName = data[0].stateorutname
        }
        if (data.clientGstin == "") {
            companyStateCode = 'UR'
        }
        else {
            let gstCode = data.clientGstin.slice(0, 2)
            let statedata = stateCodeDetails.filter((item) => {
                if (item.gstcode == gstCode) {
                    return item
                }
            })
            if (statedata.length == 0) {
                companyStateCode = 'UR'
            }
            else {
                companyStateCode = statedata[0].shortform
            }
        }
        let igstHide = data.igstRate == 0 ? 'rcm_hide' : ''
        let cgstHide = data.cgstRate == 0 ? 'rcm_hide' : ''
        let res = generatePdfContent(company, companyData, companyStateCode, data, vendorData, igstHide, cgstHide, total)
        return res
    }
    catch (e) {
        console.log(e)
    }
}

const generatePdfContent = (company, companyData, companyStateCode, data, vendorData, igstHide, cgstHide, total) => {
    // Define Table Headers
    let invoiceNumber = data.taxInvoiceNo
    data.cgstAmount = formatIndianCurrency(data.cgstAmount)
    data.igstAmount = formatIndianCurrency(data.igstAmount)
    data.amount = formatIndianCurrency(data.amount)
    total = formatIndianCurrency(total)
    if (data.cgstRate == 2) {
        data.cgstRate = 2.5
        data.sgstRate = 2.5

    }
    let tableHeaders = [
        { text: 'Particulars', style: 'tableHeader' },
        { text: 'HSN Code', style: 'tableHeader' },
        { text: 'Amount', style: 'tableHeader' }
    ];

    if (!igstHide) {
        tableHeaders.push({ text: 'IGST Rate', style: 'tableHeader' });
        tableHeaders.push({ text: 'IGST Amount', style: 'tableHeader' });
    }
    if (!cgstHide) {
        tableHeaders.push({ text: 'CGST Rate', style: 'tableHeader' });
        tableHeaders.push({ text: 'CGST Amount', style: 'tableHeader' });
        tableHeaders.push({ text: 'SGST Rate', style: 'tableHeader' });
        tableHeaders.push({ text: 'SGST Amount', style: 'tableHeader' });
    }

    // Define Table Rows
    let tableBody = [];

    // Add Data Row
    let dataRow = [
        vendorData.service,
        data.hsncode,
        { text: data.amount, alignment: 'right' }
    ];

    if (!igstHide) {
        dataRow.push({ text: `${data.igstRate}%`, alignment: 'right' });
        dataRow.push({ text: data.igstAmount, alignment: 'right' });
    }
    if (!cgstHide) {
        dataRow.push({ text: `${data.cgstRate}%`, alignment: 'right' });
        dataRow.push({ text: data.cgstAmount, alignment: 'right' });
        dataRow.push({ text: `${data.cgstRate}%`, alignment: 'right' });
        dataRow.push({ text: data.cgstAmount, alignment: 'right' });
    }

    tableBody.push(dataRow);

    // Add Total Row
    let totalRow = [
        { text: 'Total', bold: true },
        '',
        { text: data.amount, alignment: 'right' }
    ];

    if (!igstHide) {
        totalRow.push({ text: '-', alignment: 'right' });
        totalRow.push({ text: data.igstAmount, alignment: 'right' });
    }
    if (!cgstHide) {
        totalRow.push({ text: '-', alignment: 'right' });
        totalRow.push({ text: data.cgstAmount, alignment: 'right' });
        totalRow.push({ text: '-', alignment: 'right' });
        totalRow.push({ text: data.sgstAmount, alignment: 'right' });
    }

    tableBody.push(totalRow);

    let invoiceValueRow = [
        { text: 'Total Invoice Value', bold: true },
        '',
        { text: total, alignment: 'right', bold: true }
    ];

    for (let i = 3; i < tableHeaders.length; i++) {
        invoiceValueRow.push('');
    }

    tableBody.push(invoiceValueRow);

    let rcmTaxRow = [
        { text: 'Amount of Tax liable to RCM', bold: true },
        '',
        ''
    ];

    if (!igstHide) {
        rcmTaxRow.push('');
        rcmTaxRow.push({ text: data.igstAmount, alignment: 'right', bold: true });
    }
    if (!cgstHide) {
        rcmTaxRow.push('');
        rcmTaxRow.push({ text: data.cgstAmount, alignment: 'right', bold: true });
        rcmTaxRow.push('');
        rcmTaxRow.push({ text: data.sgstAmount, alignment: 'right', bold: true });
    }

    tableBody.push(rcmTaxRow);

    return {
        content: {
            content: [
                {
                    table: {
                        widths: ['100%'],
                        body: [
                            [{ text: company.companyname, style: 'header', margin: [5, 5, 5, 5], fillColor: '#ADD8E6' }]
                        ]
                    },
                    margin: [0, 0, 0, 0],
                    layout: 'noBorders',
                },
                {
                    table: {
                        widths: ['50%', '50%'], // Ensures equal column width
                        body: [
                            [
                                {
                                    text: [
                                        { text: 'GSTIN: ', bold: true },
                                        { text: `${data.clientGstin}\n\n`, lineHeight: 1.2 },
                                        { text: 'Address: ', bold: true },
                                        // { text: data.clientAddress.split('\n').map(line => ({ text: line, margin: [2, 2, 2, 2] })) },
                                        { text: `${data.clientAddress}\n\n`, lineHeight: 1.2 },
                                        { text: 'State Code: ', bold: true },
                                        { text: `${companyStateCode}\n\n`, lineHeight: 1.2 }
                                    ],
                                    margin: [5, 5, 5, 5] // Adds spacing inside cells
                                },
                                {
                                    text: [
                                        { text: 'Tax Invoice No: ', bold: true }, { text: `${data.taxInvoiceNo}\n\n`, lineHeight: 1.2 },
                                        { text: 'Date of Invoice: ', bold: true }, { text: `${data.date.split("T")[0]}\n\n`, lineHeight: 1.2 }
                                    ],
                                    margin: [5, 5, 5, 5]
                                }
                            ]
                        ]
                    },
                    layout: 'noBorders',
                    fillColor: '#ADD8E6',
                    margin: [0, 0, 0, 15]
                },
                {
                    text: 'Details of Service Provider / Supplier',
                    style: 'subheader',
                    margin: [0, 0, 0, 10]
                },
                {
                    text: [
                        { text: 'Name: ', bold: true }, `${vendorData.vendorName}\n\n`,
                        { text: 'GSTIN: ', bold: true }, `${vendorData.gstin}\n\n`,
                        { text: 'Address: ', bold: true }, `${vendorData.address}\n\n`,
                        { text: 'State Name: ', bold: true }, `${vendorData.stateName}\n\n`,
                        { text: 'State Code: ', bold: true }, `${vendorData.stateCode}\n\n`,
                        { text: 'Place Of Supply: ', bold: true }, `${data.placeOfSupply}\n\n`
                    ],
                    margin: [0, 0, 0, 10]
                },
                {
                    table: {
                        headerRows: 1,
                        widths: Array(tableHeaders.length).fill('auto'),
                        body: [tableHeaders, ...tableBody],
                        margin: [7, 7, 7, 7]
                    },
                    margin: [0, 10, 0, 10]
                },
                {
                    text: 'Notes:',
                    style: 'subheader'
                },
                {
                    ol: [
                        `Special invoice for RCM is raised by our organisation as per section 31(3)(f) of CGST Act, 2017.\n`,
                        `The amount paid to the supplier is exclusive of GST payable under RCM.\n`,
                        `This invoice is a computer-generated document and therefore does not require any signature.\n`
                    ],
                    margin: [3, 3, 3, 3]

                }
            ],
            styles: {
                header: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 12,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableHeader: {
                    bold: true,
                    fillColor: '#2c3e50',
                    color: 'white',
                    alignment: 'center'
                },
                center: {
                    alignment: 'center'
                }
            }
        },
        invoiceNumber: invoiceNumber
    };
};



async function createPDF(content) {
    return new Promise((resolve) => {
        const fonts = {
            Roboto: {
                normal: "Helvetica",
                bold: "Helvetica-Bold",
            },
        };

        const printer = new PdfPrinter(fonts);

        // Create the PDF document
        const pdfDoc = printer.createPdfKitDocument(content);
        let buffers = [];

        pdfDoc.on("data", (chunk) => buffers.push(chunk));

        pdfDoc.on("end", () => {
            const pdfBuffer = Buffer.concat(buffers);
            fs.writeFileSync("test.pdf", pdfBuffer); // Ensure the file is written after stream ends
            resolve(pdfBuffer);
        });

        pdfDoc.end();

    });

}

async function getData({ company, startDate, endDate }) {
    try {
        let getdata1 = await fetchTable(`SELECT *
    FROM tdsInvoices where companyId='${company.companyID}' and CAST([date] AS DATE) between '${startDate}' and '${endDate}'`);
        return getdata1;
    }
    catch (e) {
        return { "error": e }
    }

}


// Indian rupee conversion
function formatIndianCurrency(amount) {
    let num = Number(amount)
    let result = num.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });
    return result
}

function formatDate(dateStr) {
    let date = new Date(dateStr);
    // let day = ().toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');//updated by sathish
    let month = date.toLocaleString('en-GB', { month: 'short' });
    let year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
};

module.exports = { stateCodeDetails, reportCreation, getData, deleteData, bulkReportCreation }



