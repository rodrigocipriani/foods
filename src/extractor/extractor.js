// Just run `node extractor.js`

const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
const fs = require("fs");

function getProducts() {
  const call = axios({
    method: "get",
    url: "http://www.nware.com.br/tbca/tbca/model/medidaDAO.php"
  });
  return call
    .then(({ data }) => {
      const codes = [];
      const $ = cheerio.load(data);
      $("#produtos > tbody > tr").each(function(i, elem) {
        const code = $(this)
          .children()
          .eq(0)
          .first()
          .text()
          .trim();
        const name = $(this)
          .children()
          .eq(1)
          .first()
          .text()
          .trim();
        const group = $(this)
          .children()
          .eq(2)
          .first()
          .text()
          .trim();
        codes.push({
          code,
          name,
          group
        });
      });
      return codes;
    })
    .catch(error => {
      console.error(error);
    });
}

function getDetail(numero) {
  const call = axios({
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: qs.stringify({
      numero
    }),
    url: "http://www.nware.com.br/tbca/tbca/model/itemProdutoMedDAO.php"
  });
  return call
    .then(({ data }) => {
      const details = [];
      const $ = cheerio.load(data);
      $("#itproduto > tbody > tr").each(function(i, elem) {
        const component = $(this)
          .children()
          .eq(0)
          .first()
          .text()
          .trim();
        const unit = $(this)
          .children()
          .eq(1)
          .first()
          .text()
          .trim();
        const valueBy100g = $(this)
          .children()
          .eq(2)
          .first()
          .text()
          .trim();
        const fullSponSoup25 = $(this)
          .children()
          .eq(3)
          .first()
          .text()
          .trim();
        details.push({
          component,
          unit,
          valueBy100g,
          fullSponSoup25
        });
      });
      return details;
    })
    .catch(error => {
      console.error(error);
    });
}

function saveJson(json) {
  const text = JSON.stringify(json);
  fs.writeFile("db.json", text, "utf8", err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("File has been created");
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const mergeDetails = async products => {
  const dbJson = [];
  await asyncForEach(products, async product => {
    // await sleep(50);
    const details = await getDetail(product.code);
    const productWithDetails = { ...product, details };
    dbJson.push(productWithDetails);
    console.log(product.code);
    // console.log("product", productWithDetails);
  });
  console.log("Done");
  console.log("extract completed");
  return dbJson;
};

async function extractAndSaveOnDisk() {
  const products = await getProducts();
  saveJson(mergeDetails(products));
  console.log("saved on disk");
}

extractAndSaveOnDisk();
