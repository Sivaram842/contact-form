
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// REQUEST LOGGER
app.use((req, res, next) => {
  console.log("================================");
  console.log("INCOMING REQUEST");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("================================");

  next();
});

// Middleware


const allowedOrigins = [
  "http://localhost:5173",
  "https://doom-contact-form.netlify.app",
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));


// IMPORTANT: Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Doom Industries API is running",
  });
});

app.get("/api/test", (req, res) => {
  console.log("TEST ENDPOINT HIT");

  res.status(200).json({
    success: true,
    message: "Backend is responding correctly",
  });
});

// Routes (must come after middleware)
app.use("/api/contact", contactRoutes);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
