const createError = require('http-errors');
const CartModel = require('../models/cart');
const OrderModel = require('../models/order');
const CartItemModel = require('../models/cartItem');

module.exports = class CartService {

  async create(data) {
    const { userId } = data;

    try {

      // Instantiate new cart and save
      const Cart = new CartModel();
      const cart = await Cart.create(userId);

      return cart;

    } catch(err) {
      throw err;
    }

  };

  async get(data) {
    const { id } = data;

    try {
      // Load cart by ID
      const cart = await CartModel.findOneById(id);

      if (!cart) {
        throw createError(404, 'Cart not found');
      }

      // Load cart items and add them to the cart record
      const items = await CartItemModel.find(id);
      cart.items = items;

      return cart;

    } catch(err) {
      throw err;
    }
  }

  async loadCart(userId) {
    try {
      // Load user cart based on ID
      const cart = await CartModel.findOneByUser(userId);

      if (!cart) {
        throw createError(404, 'Cart not found for user');
      }

      // Load cart items and add them to the cart record
      const items = await CartItemModel.find(cart.id);
      cart.items = items;

      return cart;

    } catch(err) {
      throw err;
    }
  }

  async addItem(userId, item) {
    try {
      // Load user cart based on ID
      const cart = await CartModel.findOneByUser(userId);

      if (!cart) {
        throw createError(404, 'Cart not found for user');
      }

      // Validate required fields
      if (!item.productId || !item.qty) {
        throw createError(400, 'Missing required fields: productId, qty');
      }

      // Create cart item
      const cartItem = await CartItemModel.create({ cartId: cart.id, ...item });

      return cartItem;

    } catch(err) {
      throw err;
    }
  }

  async removeItem(cartItemId) {
    try {
      // Remove cart item by line ID
      const cartItem = await CartItemModel.delete(cartItemId);

      if (!cartItem) {
        throw createError(404, 'Cart item not found');
      }

      return cartItem;

    } catch(err) {
      throw err;
    }
  }

  async updateItem(cartItemId, data) {
    try {
      // Update cart item by line ID
      const cartItem = await CartItemModel.update(cartItemId, data);

      if (!cartItem) {
        throw createError(404, 'Cart item not found');
      }

      return cartItem;

    } catch(err) {
      throw err;
    }
  }

  async checkout(cartId, userId, paymentInfo) {
    try {

      // Load cart items
      const cartItems = await CartItemModel.find(cartId);

      if (!cartItems || cartItems.length === 0) {
        throw createError(400, 'Cart is empty');
      }

      // Generate total price from cart items
      const total = cartItems.reduce((total, item) => {
        return total += (Number(item.price) * item.qty);
      }, 0);

      // Generate initial order
      const Order = new OrderModel({ total, userId });
      Order.addItems(cartItems);
      const createdOrder = await Order.create();

      // Make charge to payment method
      if (paymentInfo && paymentInfo.id) {
        try {
          const stripeKey = process.env.STRIPE_SECRET_KEY;
          if (!stripeKey) {
            throw createError(500, 'Stripe API key not configured. Please set STRIPE_SECRET_KEY environment variable.');
          }
          const stripe = require('stripe')(stripeKey);
          
          const charge = await stripe.charges.create({
            amount: Math.round(total * 100),
            currency: 'usd',
            source: paymentInfo.id,
            description: 'E-commerce Charge'
          });

          // On successful charge to payment method, update order status to COMPLETE
          const updatedOrder = await Order.update({ status: 'COMPLETE' });
          return updatedOrder;
        } catch(paymentErr) {
          // Update order status to FAILED if payment fails
          await Order.update({ status: 'FAILED' });
          throw createError(400, 'Payment processing failed: ' + paymentErr.message);
        }
      }

      // If no payment info, return order with PENDING status
      return createdOrder;

    } catch(err) {
      throw err;
    }
  }

}