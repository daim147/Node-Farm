const fs = require("fs");
const http = require("http");
const { default: slugify } = require("slugify");
const url = require("url");
const replaceTemplate = require("./modules/module");

const card = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");
const overview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const product = fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8");
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
let dataObj = JSON.parse(data).map((element) => {
  const slug = slugify(element.productName, { lower: true, locale: "en-US" });

  return { ...element, id: slug };
});

// ! SERVER
const server = http.createServer((req, res) => {
  console.log(req.url);
  const { query, search, pathname } = url.parse(req.url, true);

  // ! OVERVIEW DATA
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const cardsHtml = dataObj.map((element) => replaceTemplate(card, element));

    res.end(overview.replace("{%CARD%}", cardsHtml));
  }
  // ! PRODUCT DATA
  else if (pathname === "/product" && query.id) {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const output = replaceTemplate(
      product,
      dataObj.find((arr) => arr.id === query.id)
    );
    res.end(output);
  }
  //!  API
  else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  }
  // ! NOT FOUND
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello world",
    });
    res.end("<h1>PAGE NOT FOUND</h1> ");
  }
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

server.listen(port, () => {
  console.log("LISTENING");
});

// ! SYNC WAY
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// const stringUpdated = `HEHEHEHEHEHEHHEHE ${textIn} \n Created on ${new Date().toLocaleString()}`;
// fs.writeFileSync("./txt/output.txt", stringUpdated);
// console.log(fs.readFileSync("./txt/output.txt", "utf-8"));

// ! CALLBACK HELL
// fs.readFile("./txt/start.txt", "utf-8", (_, data) => {
//   fs.readFile(`./text/${data}.txt`, "utf-8", (_, data2) => {
//     fs.readFile("./txt.append.txt", "utf-8", (_, data3) => {
//       fs.writeFile(
//         "./final.txt",
//         `${data2} \n\n ${data3}, 'utf-8 `,
//         (error) => {
//           console.log("DONE 😁😁😁😁😁😁");
//         }
//       );
//     });
//   });
// });
