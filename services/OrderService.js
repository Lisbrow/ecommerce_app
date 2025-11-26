const createError = require('http-errors');
const OrderModel = require('../models/order');
const OrderItemModel = require('../models/orderItem');

module.exports = class OrderService {

  async create(data) {
    const { userId, total } = data;

    try {

      if (!userId || total === undefined) {
        throw createError(400, 'Missing required fields: userId, total');
      }

      // Instantiate new order and save
      const Order = new OrderModel({ userId, total });
      const order = await Order.create();

      return order;

    } catch(err) {
      throw err;
    }

  };

  async list(userId) {
    try {

      if (!userId) {
        throw createError(400, 'User ID is required');
      }

      // Load user orders based on ID
      const orders = await OrderModel.findByUser(userId);

      if (!orders) {
        return [];
      }

      return Array.isArray(orders) ? orders : [orders];

    } catch(err) {
      throw err;
    }
  }

  async findById(orderId) {
    try {

      if (!orderId) {
        throw createError(400, 'Order ID is required');
      }

      // Load order by ID
      const order = await OrderModel.findById(orderId);

      if (!order) {
        throw createError(404, 'Order not found');
      }

      // Load order items
      const items = await OrderItemModel.find(orderId);
      order.items = items;

      return order;

    } catch(err) {
      throw err;
    }
  }

  async update(data) {
    try {

      const { id } = data;

      if (!id) {
        throw createError(400, 'Order ID is required');
      }

      // Check if order exists
      const order = await OrderModel.findById(id);

      if (!order) {
        throw createError(404, 'Order not found');
      }

      // Create a new OrderModel instance and update
      const orderInstance = new OrderModel(order);
      const updatedOrder = await orderInstance.update(data);

      return updatedOrder;

    } catch(err) {
      throw err;
    }
  }

}