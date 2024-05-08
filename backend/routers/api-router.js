const express = require('express')
const axios = require('axios').default;
const jsdom = require('jsdom')
const { JSDOM } = require('jsdom')
const virtualConsole = new jsdom.VirtualConsole();
const route = express.Router();
//get rid of the error 'cannot parse css file'
virtualConsole.on('error', () => { })

/*
return the following informations:
 .Product title
 .Ratings(stars out of five)
 .Number of reviews
 .Product image URL
*/
//function to return the URL used to make a call to amazon website
const amazonURL = (productSearchKey) => `https://www.amazon.com/s?k=${productSearchKey}&crid=20Q3NDNHZP4LD&sprefix=flash%2Caps%2C196&ref=nb_sb_noss_1`
const modelItens = (collection) => {
    let itensList = {}
    return Array.from(collection).map(item => {
        let imgURLElement = item.querySelector(".s-image");
        let productTitleElement = item.querySelector('.a-section[data-cy="title-recipe"]');
        let numerOfReviewsElement = item.querySelector('.s-csa-instrumentation-wrapper');
        let ratingsElement = item.querySelector('.a-icon-alt');

        ratings = ratingsElement == null ? "no ratings" : ratingsElement.textContent
        numberOfReviews = numerOfReviewsElement == null ? 0 : numerOfReviewsElement.textContent
        return {
            ...itensList,
            imgURL: imgURLElement.src,
            productTitle: productTitleElement.textContent,
            ratings,
            numberOfReviews
        }

    })
}

const connectToAmazon = async (url) => {
    let itens = [];
    const outcome = await axios.get(url, {
        //headers to fake a real client browser sending requests.
        headers: {
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            'Accept-Encoding': "gzip, deflate, br, zstd",
            'Accept-Language': "en-GB,en;q=0.9,en-US;q=0.8,pt-BR;q=0.7,pt;q=0.6",
            'Content-Type': 'text/plain;charset=UTF-8',
            Host: 'www.amazon.com',
            Origin: 'https://www.amazon.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
        }
    });
    let data = await outcome.data;
    let ratings = ""
    let numberOfReviews = 0;
    const dom = new JSDOM(data, { virtualConsole });
    let collection = dom.window.document.querySelectorAll('.s-asin');
    itens = modelItens(collection);  
    return itens;

}

//route to /api/scrape/
route.get('/api/scrape/', async (req, res) => {
    let productQueryKey = req.query.productKey
    let url = amazonURL(productQueryKey);
    //header to make sure that the response is going to be
    //in json format
    res.header({
        'Content-Type': 'application/json'
    })

    let data = await connectToAmazon(url).catch(err => console.log(err.toString()));
    res.send(JSON.stringify(data), null, 4);
})


module.exports = route