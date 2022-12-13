return

const PORT = 8000
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

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
    // declare an empty array to store the data that we'll scrape
    const fighters = [];
    const fighterImages = [];
    // finds the class of the element that we want to scrape from ufc dom and pulls the fighter info from that element.
    $('.ath-n__name', html).each(function() {
      
      const athletes = $(this).text().split('\n').join('').split("'").join('').split(' ').join('');
      const url = $(this).find('a').attr('href');
      fighters.push(athletes);
      // console.log(url);
    });
    // console.log(fighters);

    $('.c-embedded-single-media__item', html).each(function() {
      const image = $(this).find('img').attr('src');
      // add images to fighterImagers array
      fighterImages.push(image);
    })
    // console.log(fighterImages);

    // add fighters to index.ejs
    app.get('/', (req, res) => {
      res.render('index', { fighters: fighters, fighterImages: fighterImages });
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

