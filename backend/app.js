const express = require("express");
const app = express();
const cors = require("cors"); 
const morgan = require("morgan");
const blog = require("./Routes/blogs");
const User = require("./Routes/User");
const sitemap = require("./Routes/sitemap"); 
const privacy = require("./Routes/privacy");
const summaryRoutes = require("./Routes/summaryRoutes");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

dotenv.config();
app.use(morgan("tiny")); 

app.use(  
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, 
  })
);
app.use(cookieParser());
// Mount webhook route before JSON middleware
app.use("/api/v1/webhook", express.raw({ type: "application/json" }));
app.use("/api/v1", blog);
app.use("/api/v1", privacy);
app.use("/api/v1", User);
app.use("", sitemap);
app.use("/api/summary", summaryRoutes);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Book Summary API",
  });
}
);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

process.on("uncaughtException", (err) => {
  console.error(`ERROR: ${err.message}`);
  console.error("Shutting down Server due to an uncaught exception");
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error(`ERROR ${err.message}`);
  console.error("Unhandled Rejection");
  process.exit(1);
});

mongoose
  .connect(process.env.DB_CLOUD_URI)
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(process.env.PORT, () => {
      console.log(`Server started on PORT ${PORT}`);
      console.log(`Database connected successfully`);
    });
  })
  .catch((err) => console.log(err));
