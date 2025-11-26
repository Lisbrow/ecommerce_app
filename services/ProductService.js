const createError = require('http-errors');
const ProductModel = require('../models/product');
const ProductModelInstance = new ProductModel();

module.exports = class ProductService {

  async list(options) {

    try {
      // Load products
      const products = await ProductModelInstance.find(options);

      return products;

    } catch(err) {
      throw err;
    }

  };

  async get(id) {

    try {
      // Check if product exists
      const product = await ProductModelInstance.findOne(id);

      // If no product found, reject
      if (!product) {
        throw createError(404, 'Product not found');
      }

      return product;

    } catch(err) {
      throw err;
    }

  };

  async create(data) {

    try {
      // Validate required fields
      const { name, price, description } = data;
      
      if (!name || !price || !description) {
        throw createError(400, 'Missing required fields: name, price, description');
      }

      // Create new product
      const product = await ProductModelInstance.create(data);

      return product;

    } catch(err) {
      throw err;
    }

  };

  async update(data) {

    try {
      // Validate ID exists
      const { id } = data;
      
      if (!id) {
        throw createError(400, 'Product ID is required');
      }

      // Check if product exists
      const existingProduct = await ProductModelInstance.findOne(id);

      if (!existingProduct) {
        throw createError(404, 'Product not found');
      }

      // Update product
      const product = await ProductModelInstance.update(data);

      return product;

    } catch(err) {
      throw err;
    }

  };

  async delete(id) {

    try {
      // Check if product exists
      const product = await ProductModelInstance.findOne(id);

      // If no product found, reject
      if (!product) {
        throw createError(404, 'Product not found');
      }

      // Delete product
      const deletedProduct = await ProductModelInstance.delete(id);

      return deletedProduct;

    } catch(err) {
      throw err;
    }

  };

}