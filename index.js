const PORT = process.env.PORT || 3000;
const puppeteer = require('puppeteer');
const express = require('express');
const moment = require('moment');
require('dotenv').config();

const app = express();
// const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())



// Scrape fighters using Puppeteer
async function scrapeFighters() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.ufc.com/athletes', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });
  await page.waitForSelector('.ath-n__name', { timeout: 20000 });
  const fighters = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.ath-n__name')).map(el => el.innerText.trim());
  });
  const fighterImages = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.atm-thumbnail img')).map(el => el.src.trim());
  });
  const lastFight = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.view-fighter-last-fight'))
      .filter((_, i) => i % 2 === 0)
      .map(el => el.innerText.trim());
  });
  const fighterLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.ath-n__name a')).map(el => el.href.trim());
  });
  const fighterInfo = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.ath--winfo')).map(el => el.innerText.trim());
  });


  await browser.close();
  return { fighters, fighterImages, lastFight, fighterLinks, fighterInfo };
}

// In-memory cache for weekly scraping
let cachedData = null;
let lastScrapeDate = null;

app.get('/', async (req, res) => {
  const today = moment().startOf('day');
  const isMonday = today.isoWeekday() === 1; // Monday = 1
  let useCache = false;

  if (cachedData && lastScrapeDate && lastScrapeDate.isSame(today, 'day')) {
    useCache = true;
  }

  if (!useCache && isMonday) {
    try {
      cachedData = await scrapeFighters();
      lastScrapeDate = today;
      console.log('Scraped new data on Monday.');
    } catch (err) {
      console.log('Puppeteer scrape error:', err.message);
      // fallback to cache if available
      if (!cachedData) cachedData = { fighters: [], fighterImages: [], lastFight: [], fighterLinks: [], fighterInfo: [] };
    }
  } else if (!cachedData) {
    // If cache is empty and not Monday, scrape once
    try {
      cachedData = await scrapeFighters();
      lastScrapeDate = today;
      console.log('Scraped new data (first run or cache empty).');
    } catch (err) {
      console.log('Puppeteer scrape error:', err.message);
      cachedData = { fighters: [], fighterImages: [], lastFight: [], fighterLinks: [], fighterInfo: [] };
    }
  }

  res.render('index', {
    fighters: cachedData.fighters,
    fighterImages: cachedData.fighterImages,
    fighterLinks: cachedData.fighterLinks,
    fighterInfo: cachedData.fighterInfo,
    moment: moment,
    lastFight: cachedData.lastFight
  });
});
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
}).on('error', (err) => {
  console.log(err);
}).on('listening', () => {
  console.log(`Server listening on PORT ${PORT}`);
}).on('close', () => {
  console.log(`Server closed on PORT ${PORT}`);
}).on('connection', () => {
  console.log(`Server connected on PORT ${PORT}`);
}).on('disconnect', () => {
  console.log(`Server disconnected on PORT ${PORT}`);
});

