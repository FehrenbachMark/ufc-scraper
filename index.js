const PORT = process.env.PORT || 3000;
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const moment = require('moment');
require('dotenv').config();

const app = express();
// const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


const url = 'https://www.ufc.com/athletes'
axios(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    // declares empty arrays to store the data that we'll scrape
    const fighters = [];
    const fighterInfo = [];
    const fighterImages = [];
    const fighterLinks = [];
    const lastFight = [];
    // finds the class of the element that we want to scrape from ufc dom and pulls the fighter info from that element.
    $('.ath-n__name', html).each(function () {

      const athletes = $(this).text().split('\n').join('').split("'").join('').split(' ').join('');
      const url = $(this).find('a').attr('href');
      fighters.push(athletes.split(/(?=[A-Z])/).join(' '));
      fighterLinks.push("https://ufc.com" + url);
    });
    // console.log(fighters);

    // finds the fighters images and adds them to the fighterImages array
    $('.c-embedded-single-media__item', html).each(function () {
      const image = $(this).find('img').attr('src');
      // add images to fighterImagers array
      fighterImages.push(image);
    })
    // console.log(fighterImages);
    // finds the fighters info and adds them to the fighterInfo array
    $('.ath--winfo', html).each(function () {
      const info = $(this).text().split('\n').join('').split("'").join('').split(' ').join('');
      let newInfo = info.split(/(?=[A-Z])/).join(' ');
      let formattedFighterInfo = newInfo.replace(/\d+/, " $&");
      fighterInfo.push(formattedFighterInfo);
    })
    // console.log(fighterInfo);

    // finds the fighters last fight and adds them to the lastFight array
    $('.ath-lf .view-fighter-last-fight', html).each(function () {
      const lastFightInfo = $(this).find('.views-row').text();
      lastFight.push(lastFightInfo);      
    })
    // console.log(lastFight);

    // removes every other element in the array for formatting purposes
    for (let i = 0; i < lastFight.length; i++) {
      if (i % 2 !== 0) {
        lastFight.splice(i, 2);
      }
    }

    // console.log(lastFight);


    app.get('/', (req, res) => {
      res.render('index', { fighters: fighters, fighterImages: fighterImages, fighterLinks: fighterLinks, fighterInfo: fighterInfo, moment: moment, lastFight: lastFight });
    });

  })
  .catch(error => {
    console.log(error);
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

