
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser"); 

dotenv.config(); // ⚠️ Place at the top

const blog = require("./Routes/blogs");
const User = require("./Routes/User");
const sitemap = require("./Routes/sitemap");
const privacy = require("./Routes/privacy");
const summaryRoutes = require("./Routes/summaryRoutes");
const subscriptionRoutes = require("./Routes/SubscriptionRoutes");
const { handleWebhook } = require("./Controllers/subscriptionController");

// Handle CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(morgan("tiny")); 
app.post('/api/v1/webhook', 
  bodyParser.raw({ type: 'application/json' }), 
  handleWebhook
);
app.use(express.json({ limit: "10mb" }));
// 🔐 Webhook route must come BEFORE express.json()

// Raw body parser for Stripe webhook ONLY


// Normal JSON parsing for all other routes


// Mount other routes
app.use("/api/v1", blog);
app.use("/api/v1", privacy);
app.use("/api/v1", User);
app.use("", sitemap);  
app.use("/api/summary", summaryRoutes);

app.use("/api/v1", subscriptionRoutes); // <-- include this here

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Book Summary API",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Crash-safe
process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

// DB Connection
mongoose
  .connect(process.env.DB_CLOUD_URI)
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server started on PORT ${PORT}`);
      console.log(`✅ Database connected successfully`);
    });
  })
  .catch((err) => console.log("MongoDB connection error:", err));
