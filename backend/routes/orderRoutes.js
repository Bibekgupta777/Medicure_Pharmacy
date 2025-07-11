import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { isAuth, isAdmin, mailgun, payOrderEmailTemplate } from '../utils.js';

const orderRouter = express.Router();

// Admin: get all orders
orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name email');
    res.send(orders);
  })
);

// User: create new order
orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (!req.body.orderItems || req.body.orderItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' });
      return;
    }

    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      discountPrice: req.body.discountPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,

      // NEW: Prescription fields
      prescription: req.body.prescription || '', // URL from Cloudinary upload
      isPrescriptionRequired:
        req.body.isPrescriptionRequired === true || req.body.isPrescriptionRequired === 'true',
    });

    const order = await newOrder.save();
    res.status(201).send({ message: 'New Order Created', order });
  })
);

// summary
orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      { $group: { _id: null, numOrders: { $sum: 1 }, totalSales: { $sum: '$totalPrice' } } },
    ]);
    const users = await User.aggregate([{ $group: { _id: null, numUsers: { $sum: 1 } } }]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  })
);

// get orders for logged-in user
orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

// get by id
orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

// pay
orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'email name');
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id || '',
        status: req.body.status || '',
        update_time: req.body.update_time || '',
        email_address: req.body.email_address || '',
      };
      if (req.body.paymentMethod) {
        order.paymentMethod = req.body.paymentMethod;
      }
      const updatedOrder = await order.save();

      mailgun()
        .messages()
        .send(
          {
            from: 'yourstore <no-reply@yourdomain.com>',
            to: `${order.user.name} <${order.user.email}>`,
            subject: `Order Paid: ${order._id}`,
            html: payOrderEmailTemplate(order),
          },
          (error, body) => {
            if (error) {
              console.error(error);
            } else {
              console.log(body);
            }
          }
        );

      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

// deliver
orderRouter.put(
  '/:id/deliver',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.deliveryStatus = 'delivered'; // update status
      await order.save();
      res.send({ message: 'Order Delivered', order });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

// cancel
orderRouter.put(
  '/:id/cancel',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      if (req.user.isAdmin || order.user.toString() === req.user._id.toString()) {
        order.isCancelled = true;
        order.deliveryStatus = 'cancelled'; // update status
        await order.save();
        res.send({ message: 'Order cancelled', order });
      } else {
        res.status(403).send({ message: 'Not authorized to cancel this order' });
      }
    } else {
      res.status(404).send({ message: 'Order not found' });
    }
  })
);

// admin update delivery status
orderRouter.put(
  '/:id/status',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { deliveryStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (order) {
      order.deliveryStatus = deliveryStatus;
      if (deliveryStatus === 'delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
      await order.save();
      res.send({ message: 'Delivery status updated', order });
    } else {
      res.status(404).send({ message: 'Order not found' });
    }
  })
);

export default orderRouter;
