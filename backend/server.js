import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Listing from "./models/Listing.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", methods: ["GET", "POST", "DELETE"] }));
app.use(express.json());

// __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Serve uploads
app.use("/uploads", express.static(uploadsDir));

// Get all listings
app.get("/api/listings", async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

// Create listing
app.post("/api/listings", upload.single("image"), async (req, res) => {
  try {
    const { title, location, price, description } = req.body;
    if (!req.file) return res.status(400).json({ error: "Image is required" });

    const newListing = new Listing({
      title,
      location,
      price,
      description,
      booked: false,
      imageUrl: `/uploads/${req.file.filename}`,
    });

    await newListing.save();
    res.status(201).json({ message: "Listing uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error uploading listing" });
  }
});

// Delete listing
app.delete("/api/listings/:id", async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete listing" });
  }
});

// Book listing
app.post("/api/book/:id", async (req, res) => {
  try {
    const { nights } = req.body;
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    if (listing.booked) return res.status(400).json({ error: "Listing already booked" });

    listing.booked = true;
    listing.bookingDetails = { nights };
    await listing.save();

    res.json({ message: "Booking successful" });
  } catch (err) {
    res.status(500).json({ error: "Booking failed" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
