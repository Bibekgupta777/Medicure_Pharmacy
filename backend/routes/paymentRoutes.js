// backend/routes/paymentRouter.js
import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe('sk_test_51R3qvbJ8hHU1KUt5vgLeKNFVYGK4sJbgODBeHFrhxDlSA0rzc2pRVNkzh73R5d5QW9mWFCATI5VH3GmQWPs8TzFF00eDFHkEaU');

const paymentRouter = express.Router();

paymentRouter.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return res.status(400).send({ message: 'Amount and currency required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).send({ message: error.message });
  }
});

export default paymentRouter;
