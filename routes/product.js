const express = require('express');
const router = express.Router();

const ProductService = require('../services/ProductService');
const ProductServiceInstance = new ProductService();

module.exports = (app) => {

  app.use('/products', router);

  router.get('/', async (req, res, next) => {
    try {

      const queryParams = req.query;

      const response = await ProductServiceInstance.list(queryParams);
      res.status(200).send(response);
    } catch(err) {
      next(err);
    }
  });

  router.get('/:productId', async (req, res, next) => {
    try {
      const { productId } = req.params;

      const response = await ProductServiceInstance.get(productId);

      res.status(200).send(response);
    } catch(err) {
      next(err);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const data = req.body;

      const response = await ProductServiceInstance.create(data);

      res.status(201).send(response);
    } catch(err) {
      next(err);
    }
  });

  router.put('/:productId', async (req, res, next) => {
    try {
      const { productId } = req.params;
      const data = req.body;

      const response = await ProductServiceInstance.update({ id: productId, ...data });

      res.status(200).send(response);
    } catch(err) {
      next(err);
    }
  });

  router.delete('/:productId', async (req, res, next) => {
    try {
      const { productId } = req.params;

      const response = await ProductServiceInstance.delete(productId);

      res.status(200).send(response);
    } catch(err) {
      next(err);
    }
  });
}