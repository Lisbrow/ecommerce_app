const db = require('../db');
const pgp = require('pg-promise')({ capSQL: true });

module.exports = class ProductModel {

  /**
   * List products
   * @param  {Object} options [Query options]
   * @return {Array}          [Array of products]
   */
  async find(options = {}) {
    try {

      const statement = `SELECT *
                         FROM products`;
      const values = [];
  
      const result = await db.query(statement, values);

      if (result.rows?.length) {
        return result.rows;
      }

      return [];

    } catch(err) {
      throw err;
    }
  }

  /**
   * Retrieve product by ID
   * @param  {Object}      id [Product ID]
   * @return {Object|null}    [Product record]
   */
  async findOne(id) {
    try {

      const statement = `SELECT *
                         FROM products
                         WHERE id = $1`;
      const values = [id];
  
      const result = await db.query(statement, values);

      if (result.rows?.length) {
        return result.rows[0]
      }
  
      return null;

    } catch(err) {
      throw err;
    }
  }

  /**
   * Creates a new product
   * @param  {Object}      data [Product data]
   * @return {Object|null}      [Created product record]
   */
  async create(data) {
    try {

      // Generate SQL statement - using helper for dynamic parameter injection
      const statement = pgp.helpers.insert(data, null, 'products') + ' RETURNING *';
  
      // Execute SQL statment
      const result = await db.query(statement);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;

    } catch(err) {
      throw new Error(err);
    }
  }

  /**
   * Updates a product record
   * @param  {Object}      data [Product data]
   * @return {Object|null}      [Updated product record]
   */
  async update(data) {
    try {

      const { id, ...params } = data;

      // Generate SQL statement - using helper for dynamic parameter injection
      const condition = pgp.as.format('WHERE id = ${id} RETURNING *', { id });
      const statement = pgp.helpers.update(params, null, 'products') + condition;
  
      // Execute SQL statment
      const result = await db.query(statement);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;

    } catch(err) {
      throw new Error(err);
    }
  }

  /**
   * Deletes a product record
   * @param  {number}      id [Product ID]
   * @return {Object|null}    [Deleted product record]
   */
  async delete(id) {
    try {

      // Generate SQL statement
      const statement = `DELETE FROM products
                         WHERE id = $1
                         RETURNING *`;
      const values = [id];
  
      // Execute SQL statment
      const result = await db.query(statement, values);

      if (result.rows?.length) {
        return result.rows[0]
      }
  
      return null;

    } catch(err) {
      throw new Error(err);
    }
  }
}