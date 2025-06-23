
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
var express = require('express');
var cors = require('cors');
var fileUpload = require("express-fileupload")

var app = express();
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors({
  origin: "http://desktop-dssus3g:90"
}));




app.get('/allFiles', async (req, res) => {
  let files = await main();
  let file = { "file": files };
  res.send(file);
})
app.post('/proposalSend', async (req, res) => {
  let result = req.body;
  res.send(result);
  let htmlData = result.data;
  let blobbName = result.contractID;
  console.log(blobbName);
  await uploadHtmlFile(htmlData, blobbName);
})
app.post('/proposal1.html', async (req, res) => {
  let b = req.body;
  let contractID = b.contractID;
  let t = await retrieveAndDisplayHtml(contractID);
  let sendData = { "data": t }
  res.send(sendData);
})


// zoho outstanding invoices endpoint
app.post('/getzohoinvoices', async (req, res) => {
  let data = req.body;
  let t = await zohoOpenInvoices(data);
  let sendData = { "data": t }
  res.send(sendData);
})


// Authentication and functions start
const accountName = "ggshstorageaccount";
const accountKey = "0IXQ76pgBXL7aUwsh42/wCSLAfFYNoZhx5n4Gy4XyiSohH0+2pizCUhZ9kNeSMWRz3KvM6OgDjpW+AStau5gMA=="; // pHYFfJ9pTdEZrsd3ffVPMp3U5F8vUhkK6Q9fnK3cspCTubWZ9gHJFsc9j+qV7RBzSJJUgbZvLtOX+AStL1jNuQ==
const containerName = "ggshstorageblobcontainer";
const blobName = "proposal_ranjithtest.html";

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);
const containerClient = blobServiceClient.getContainerClient(containerName);

async function main() {
  try {

    let fileList = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      fileList.push(blob.name);
      // console.log(`Blob Name: ${blob.name}`);
    }

    return fileList;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function uploadHtmlFile(htmlData, contractID) {
  const uploadBlobName = `proposal_${contractID}.html`;
  const blockBlobClient = containerClient.getBlockBlobClient(uploadBlobName);

  // Replace this with the HTML file content
  const htmlContent = htmlData;

  const uploadBlobResponse = await blockBlobClient.upload(htmlContent, htmlContent.length);

  console.log(`Upload status: ${uploadBlobResponse._response.status}`);
}

async function retrieveAndDisplayHtml(file) {
  const documentationBlobName = `${file}.html`;

  const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${documentationBlobName}`;
  try {
    const response = await fetch(blobUrl);
    if (response.ok) {
      const htmlContent = await response.text();
      return htmlContent;

      // document.getElementById("htmlContent").innerHTML = htmlContent;
    } else {
      console.error(`Failed to retrieve the HTML file. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error retrieving HTML file:", error);
  }
}

// upload video
app.post('/uploadDocumentationfile', async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No file uploaded.');
    }
    const file = req.files.file;
    const originalname = file.name;
    const teamName = req.body.teamName;
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobName = `academyVideo-${new Date().getTime()}-${teamName}-${originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(file.data, file.data.length, {
      blobHTTPHeaders: {
        blobContentType: 'application/octet-stream',
      },
    });

    const blobUrl = blockBlobClient.url;
    res.status(200).json({
      message: 'File uploaded successfully.',
      originalname: originalname,
      teamName: teamName,
      blobUrl: blobUrl,
    });
  } catch (error) {
    res.status(500).send('Error uploading file.');
  }
});


// upload video end
// upload pdf
app.post('/uploadPdf', async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No file uploaded.');
    }
    const file = req.files.file;
    const originalname = file.name;
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobName = `academyPdf-${new Date().getTime()}-${originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(file.data, file.data.length, {
      blobHTTPHeaders: {
        blobContentType: 'application/pdf',
      },
    });

    const blobUrl = blockBlobClient.url;
    res.status(200).json({
      message: 'File uploaded successfully.',
      originalname: originalname,
      pdfblobUrl: blobUrl,
    });
  } catch (error) {
    res.status(500).send('Error uploading file.');
  }
});

// upload pdf end`` 


// upload image start

app.post('/uploadImage', async (req, res) => {
  try {
      if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).send('No file uploaded.');
      }
      const file = req.files.file;
      const originalname = file.name;
      const containerClient = blobServiceClient.getContainerClient(containerName);

      const blobName = `file-${new Date().getTime()}-profileImage-${originalname}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.upload(file.data, file.data.length, {
          blobHTTPHeaders: {
              blobContentType: 'application/octet-stream',
          },
      });

      const blobUrl = blockBlobClient.url;
      console.log('File uploaded successfully. Blob URL:', blobUrl);

      res.status(200).json({
          message: 'File uploaded successfully.',
          originalname: originalname,
          blobUrl: blobUrl,
      });
  } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('Error uploading file.');
  }
});


// upload image end

// zoho fetch start
async function zohoOpenInvoices(data) {
  cred = data["res"]

  let CLIENT_ID = cred['clientID']
  let CLIENT_SECRET = cred['clientSecret']
  let REFRESH_TOKEN = cred['refreshToken']
  let ORGANIZATION_ID = cred['orgID']
  let redirect_uri = 'https://accounts.zoho.in/oauth/v2/token?'

  let refreshing_token_response = await fetch(`https://accounts.zoho.in/oauth/v2/token?refresh_token=${REFRESH_TOKEN}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${redirect_uri}&grant_type=refresh_token`, {
    method: "POST",
  });
  let refreshing_token_json = await refreshing_token_response.json()
  let refreshing_token = refreshing_token_json['access_token']

  let page = 1
  let isNextPage = true
  let df_list = []
  let invoice_json_list = []

  while (isNextPage) {

    Authorization = 'Zoho-oauthtoken ' + refreshing_token
    header = {
      'Authorization': Authorization
    }

    let invoices_response = await fetch(`https://www.zohoapis.in/books/v3/invoices?organization_id=${ORGANIZATION_ID}&page=${page}&balance_not_equal=0`, {
      method: "GET",
      headers: header
    });


    let invoices_json = await invoices_response.json();

    let invoices = invoices_json['invoices'];


    for (let i = 0; i < invoices.length; i++) {
      let inv_row = invoices[i];
      let invoice_id = inv_row["invoice_id"];

      let comment_response = await fetch(`https://www.zohoapis.in/books/v3/invoices/${invoice_id}?organization_id=${ORGANIZATION_ID}`, {
        method: "GET",
        headers: header
      });

      let comment_json = await comment_response.json();
      let comments = comment_json["invoice"]["line_items"]

      let c = 0
      let description = []
      for (let j = 0; j < comments.length; j++) {
        let commentRow = comments[j];
        c += 1
        let des = "item" + (c).toString() + " :" + commentRow["name"] + " - " + commentRow["description"]
        description.push(des)

      }
      inv_row["description"] = description;
    }
    invoice_json_list.push(invoices)

    isNextPage = invoices_json['page_context']['has_more_page']

    if (isNextPage) {
      page += 1
    }
  }
  return (invoice_json_list);
}
// zoho fetch end

// Authentication and functions end

module.exports = app



