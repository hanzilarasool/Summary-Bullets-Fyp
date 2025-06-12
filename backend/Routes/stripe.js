import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  const { userId, priceId, selectedPlan } = req.body;

  if (!userId || !priceId || !selectedPlan) {
    return res.status(400).json({ error: 'Missing required fields: userId, priceId, selectedPlan' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let customerId = user.stripeCustomerId;

    // If the user doesn't have a Stripe customer ID, create one
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user._id.toString(),
        },
      });

      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    user.stripeCheckoutSessionId = session.id;
    user.selectedPlan = selectedPlan;
    await user.save();

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Something went wrong creating the checkout session' });
  }
});

export default router;
