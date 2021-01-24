const express = require('express');
const bodyParser = require('body-parser');
const port = 4002;
const app = express();
const dbQuery = require('../database/query.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/../client/dist'));


app.get('/photos/id/:productId', (req, res) => {
  let productId = req.params.productId;
  dbQuery.getAllProductPhotos(productId)
  .then(productPhotoUrls => {
    console.log(productPhotoUrls);
    if (!productPhotoUrls) {
      res.status(404).send('Invalid product id');
    } else {
      res.status(200).send(JSON.stringify(productPhotoUrls));
    }
  });
});

app.get('/photos/product/:productId/primary', (req, res) => {
  let productId = req.params.productId;
  dbQuery.getProductPrimaryPhoto(productId)
  .then(primaryPhotoUrl => {
    if (!primaryPhotoUrl) {
      res.status(404).send('Invalid product id');
    } else {
      res.status(200).send(JSON.stringify(primaryPhotoUrl));
    }
  });
});

app.get('/photos/features/:productId', (req, res) => {
  let productId = req.params.productId;
  dbQuery.getProductFeaturesPhotos(productId)
  .then(featuresPhotosUrls => {
    if (!featuresPhotosUrls) {
      res.status(404).send('Invalid product id');
    } else {
      res.status(200).send(JSON.stringify(featuresPhotosUrls));
    }
  });
});

app.post('/photos/product/primary/multiple', (req, res) => {
  let productIds = req.body;
  if (productIds.length > 30 || productIds.length === 0 || !productIds) {
    res.status(400).send('Request limit is 30 product ids');
  } else {
    dbQuery.getMultipleProductsPrimaryPhotos(productIds)
    .then(primaryPhotoUrls => res.status(200).send(JSON.stringify(primaryPhotoUrls)));
  }
});


app.listen(port, () => console.log(`listening on port ${port}`));

module.exports = app;