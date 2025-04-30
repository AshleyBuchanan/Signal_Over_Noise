const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

async function scrapeAPNews() {
    const url = 'https://apnews.com';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const articles = [];

    $('span.PagePromoContentIcons-text').each((i, el) => {
        const title = $(el).text();
        const link = 'https://apnews.com' + $(el).attr('href');
        articles.push({ i, title, link });
    });

    //console.log(articles.slice(0, 10));
}

scrapeAPNews();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    console.log('hit');
    res.render('dash');
});

app.listen(port, () => console.log(`SON_Server listening on port:${port}`));
