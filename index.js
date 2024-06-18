import express, { response } from "express";
import bodyParser from "body-parser";
import axios from "axios";
import fs from "fs";
const port = 3000;
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
var data1;
var data2;
app.set('view engine', 'ejs');
async function stockmarket(symbol) {
  try {
    const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=UPU3V2427AFU928D`);
    const result = JSON.stringify(response.data);
    let first = JSON.parse(result)["Time Series (1min)"];
    let second = Object.keys(first)[0];
    let dataa = first[second];

    const open = parseFloat(dataa["1. open"]);
    const close = parseFloat(dataa["4. close"]);
    console.log(open);
    console.log(symbol);
    return {
      open,
      close,
    }
  } catch (error) {
    console.error("Failed to make request:", error.message);
    console.log(symbol);
    return null;
  }
};
app.get("/", async (req, res) => {
  const symbols = ['IBM', 'AAPL', 'MSFT', 'AMZN', 'NVDA'];
  const stockks = [];
  try {
    for (let i = 0; i < 5; i++) {
      const data3 = await stockmarket(symbols[i]);
      if (data3) {
        stockks.push(data3);
      } else {
        stockks.push({ open: "N/A", close: "N/A" });  // Handle undefined values
      }
    }

    console.log(stockks);
    console.log(stockks[0]);
    res.render("index.ejs", { stock: stockks, });
  }
  catch (error) {
    console.error("Failed to fetch stock data:", error.message);
    res.status(500).send("Internal Server Error");

  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});