require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY,{ apiVersion: "2023-10-16" });
const User = require("../Models/User");
 
exports.subscribeUser = async (req, res) => {
  const { plan } = req.body;
  const { id } = req.user; // from verifyToken middleware

  if (!["basic", "standard", "premium"].includes(plan)) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: id.toString() },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
      console.log("User after save:", user);
      console.log(`Created Stripe customer ${customerId} for user ${id}`);
    }

    const prices = {
      basic: 500,
      standard: 1000,
      premium: 2000,
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
            },
            unit_amount: prices[plan],
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.CLIENT_URL}/subscription-success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
      metadata: { userId: id.toString(), plan },
      subscription_data: {
        metadata: {
          userId: id.toString(),
          plan,
        },
      },
    });

    // 🔴 TEMPORARY DB update — replace with webhook logic
    // user.isPremium = true;
    // user.plan = plan;
    // await user.save();
    // console.log("User after save:", user);
    // console.log(`TEMPORARY: Updated user ${id} as premium with plan ${plan}`);

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Subscribe error:", error.message, error.stack);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
};

exports.handleWebhook = async (req, res) => {
  console.log("Webhook received:", req.headers, req.body);

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log(`Received webhook event: ${event.type} (ID: ${event.id})`);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: "Webhook signature verification failed" });
  }

  try {
    switch (event.type) {
   case "checkout.session.completed": {
  const session = event.data.object;
  const { userId, plan } = session.metadata;
  const subscriptionId = session.subscription;

  if (!userId || !plan || !subscriptionId) {
    console.error(`Missing metadata or subscriptionId in session:`, session.metadata);
    break;
  }

  const user = await User.findById(userId);
  if (!user) {
    console.error(`User not found for userId: ${userId}`);
    break;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  console.log("Fetched Stripe Subscription:", subscription);


  // ✅ Add the check here:
  if (subscription && subscription.current_period_end) {
    user.expiresAt = new Date(subscription.current_period_end * 1000);
    console.log("Set user.expiresAt to:", user.expiresAt);
  } else {
    console.error("Subscription missing current_period_end");
    break;
  }

  user.plan = plan;
  user.subscription = {
    summaryRequestsUsed: 0,
    pdfDownloadsUsed: 0,
    downloadHistory: [],
  };
  user.stripeCustomerId = session.customer;
  user.isPremium = plan !== "free";
  await user.save();
  console.log("User after save:", user);

  console.log(`Updated user ${userId} with ${plan} plan, expires at ${user.expiresAt}`);
  break;
}
case "invoice.paid": {
  const invoice = event.data.object;
  const subscriptionId = invoice.subscription;

  if (!subscriptionId) {
    console.error("invoice.paid event does not have a subscriptionId. Skipping update.");
    break;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  console.log("Fetched Stripe Subscription:", subscription);
  const userId = subscription.metadata.userId;

  if (!userId) {
    console.error(`No userId in subscription metadata for ${subscriptionId}`);
    break;
  }

  const user = await User.findById(userId);
  if (!user) {
    console.error(`User not found for userId: ${userId}`);
    break;
  }

  // ✅ Add the check here:
  if (subscription && subscription.current_period_end) {
    user.expiresAt = new Date(subscription.current_period_end * 1000);
    console.log("Set user.expiresAt to:", user.expiresAt);
    
  } else {
    console.error("Subscription missing current_period_end");
    break;
  }

  user.subscription.summaryRequestsUsed = 0;
  user.subscription.pdfDownloadsUsed = 0;
  await user.save();
console.log("User after save:", user);
  console.log(`Renewed subscription for user ${userId}, expires at ${user.expiresAt}`);
  break;
}

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const userId = subscription.metadata.userId;

        console.log(`Processing customer.subscription.deleted for subscription ${subscription.id}`);

        if (!userId) {
          console.error(`No userId in subscription metadata for ${subscription.id}`);
          break;
        }

        const user = await User.findById(userId);
        if (!user) {
          console.error(`User not found for userId: ${userId}`);
          break;
        }

        user.plan = "free";
        user.isPremium = false;
        user.subscription = {
          summaryRequestsUsed: 0,
          pdfDownloadsUsed: 0,
          downloadHistory: [],
        };
        user.expiresAt = null; // <-- now top-level

        await user.save();
        console.log("User after save:", user);
        console.log(`Cancelled subscription for user ${userId}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook handling error:", error.message, error.stack);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};
exports.getSubscriptionStatus = async (req, res) => {
  const { id } = req.user; // from verifyToken middleware

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(200).json({
      isPremium: user.isPremium,
      plan: user.plan,
      subscription: user.subscription,
      expiresAt: user.expiresAt, // ✅ add this line
    });
  } catch (error) {
    console.error("Get subscription status error:", error.message, error.stack);
    return res.status(500).json({ error: "Failed to retrieve subscription status" });
  }
};