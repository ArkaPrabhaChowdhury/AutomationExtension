import puppeteer from "puppeteer";
import express from "express";
var app = express();
import cors from "cors";
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
app.post("/house", async (req, res) => {
  console.log(req.body);
  const location = req.body.location;
  const price = req.body.price;
  const people = req.body.people;
  console.log(location);
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      args: ["--start-maximized"],
    });
    const page = await browser.newPage();
    await page.goto("https://www.redfin.com/");
    await page.type("#search-box-input", location);
    await page.click(".SearchButton");
    await delay(10000);
    await page.waitForSelector('div[aria-label="All filters"]');
    // Click on the div
    await page.click('div[aria-label="All filters"]');
    await page.waitForSelector('input[placeholder="Enter max"]');
    await page.type('input[placeholder="Enter max"]', price);
    if (people > 4) {
      await page.waitForSelector(`div[aria-label="5+"]`);
      await page.click(`div[aria-label="5+"]`);
    } else {
      await page.waitForSelector(`div[aria-label="${people}"]`);
      await page.click(`div[aria-label="${people}"]`);
      await page.click(`div[aria-label="${people}"]`);
    }
    await page.waitForSelector(`button[type="submit"]`);
    await page.click(`button[type="submit"]`);
  } catch (e) {
    console.log(e);
  }
});

app.post("/person", async (req, res) => {
  console.log(req.body);
  const person = req.body.person;
  const company = req.body.company;
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: false,
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      args: ["--start-maximized"],
    });
    const page = await browser.newPage();
    await page.goto("https://login.salesforce.com");
    await page.type("#username", "arkopra-uazh@force.com");
    await page.type("#password", "Caradasa@1");
    await page.click("#Login");
    await page.waitForSelector('a[title="Leads"]');
    await page.click('a[title="Leads"]');
    await page.waitForSelector('div[title="New"]');
    await page.click('div[title="New"]');
    let firstName = "";
    let middleName = "";
    let lastName = "";
    const nameComponents = person.split(" ");

    if (nameComponents.length === 1) {
      // If only one name is provided, assume it's the first name
      firstName = nameComponents[0];
      await page.waitForSelector('input[name="firstName"]');
      await page.type('input[name="firstName"]', firstName);
    } else if (nameComponents.length === 2) {
      // If two names are provided, assume the first is the first name and the second is the last name
      firstName = nameComponents[0];
      lastName = nameComponents[1];
      await page.waitForSelector('input[name="firstName"]');
      await page.type('input[name="firstName"]', firstName);
      await page.type('input[name="lastName"]', lastName);
    } else {
      // If more than two names are provided, assume the first is the first name, the last is the last name,
      // and everything in between is the middle name(s)
      firstName = nameComponents[0];
      lastName = nameComponents[nameComponents.length - 1];
      middleName = nameComponents.slice(1, nameComponents.length - 1).join(" ");
      await page.waitForSelector('input[name="firstName"]');
      await page.type('input[name="firstName"]', firstName);
      await page.type('input[name="middleName"]', middleName);
      await page.type('input[name="lastName"]', lastName);
    }

    await page.type('input[name="Company"]', company);
    await page.waitForSelector('button[name="SaveEdit"]');
    await page.click('button[name="SaveEdit"]');
  } catch (e) {
    console.log(e);
  }
});

app.post("/call", async (req, res) => {
  console.log(req.body);
  const person = req.body.person;
  const comment = req.body.comment;
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: false,
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      args: ["--start-maximized"],
    });
    const page = await browser.newPage();
    await page.goto("https://login.salesforce.com");
    await page.type("#username", "arkopra-uazh@force.com");
    await page.type("#password", "Caradasa@1");
    await page.click("#Login");
    await page.waitForSelector('a[title="Leads"]');
    await page.click('a[title="Leads"]');
    await page.waitForSelector(`a[title="${person}"]`);
    await page.click(`a[title="${person}"]`);
    await page.waitForSelector('span[value="LogACall"]');
    await page.click('span[value="LogACall"]');
    await page.waitForSelector('textarea[role="textbox"]');
    await page.click('textarea[role="textbox"]');
    await page.type('textarea[role="textbox"]', comment);
    await page.waitForSelector(
      'button[class="slds-button slds-button--brand cuf-publisherShareButton uiButton"]'
    );
    await page.click(
      'button[class="slds-button slds-button--brand cuf-publisherShareButton uiButton"]'
    );
  } catch (e) {
    console.log(e);
  }
});
app.listen(4000);
