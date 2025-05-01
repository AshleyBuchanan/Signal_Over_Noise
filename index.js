const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

let detailArticle = {};
const bigArticles = [];
const medArticles = [];
const lilArticles = [];

async function scrapeAPNews(specific, url) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let look;
    url === 'https://apnews.com' ? look = 'a' : look = 'p';

    $(specific).each((id, el) => {
        const title = $(el).find(look).text().trim();
        const href = $(el).find(look).attr('href');
        const img = $(el).find('img').attr('src');
        const width = $(el).find('img').attr('width');

        if (url === 'https://apnews.com') {
            if (img) {
                if (width < 100) {
                    medArticles.push({ id, title, href, img });
                }
                if (width > 100) {
                    bigArticles.push({ id, title, href, img });
                }
            } else {
                lilArticles.push({ id, title, href });
            }
        } else {
            detailArticle = { id, title, href, img };
        }

    });

    //console.log(detailArticle);
}

scrapeAPNews('div.PagePromo', 'https://apnews.com');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('dash', { bigArticles, medArticles, lilArticles });
});

app.get('/story/:id', (req, res) => {
    const storyId = req.params.id;
    console.log('Story ID:', storyId);

    const article = bigArticles.find(article => article.id == storyId);
    console.log(article);
    (async () => {
        await scrapeAPNews('div.RichTextStoryBody', article.href);
        console.log(detailArticle);
        res.render('story', { detailArticle, article });
    })();


});

app.listen(port, () => console.log(`SON_Server listening on port:${port}`));
