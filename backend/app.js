const express = require("express");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

// Middleware to parse incoming JSON
app.use(express.json());

// Set CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

// Routes
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

// Fallback route for unmatched paths
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// General error handling middleware
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

// Database connection
const MONGO_URI =
  "mongodb+srv://davidpopusoi52:nVwEbocFsE6br0XI@maincluster.i2wtz.mongodb.net/?retryWrites=true&w=majority&appName=MainCluster";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    app.listen(5001, () => {
      console.log("Server is running on port 3000.");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
  });
