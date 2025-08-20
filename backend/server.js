import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import Listing from "./models/Listing.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/**
 * POST /api/listings => Create a listing
 */
app.post("/api/listings", upload.single("image"), async (req, res) => {
  try {
    const { title, location, price, description, contact } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const listing = new Listing({
      title,
      location,
      price,
      description,
      contact,
      image: req.file ? req.file.filename : "",
      imageUrl,
      booked: false,
      bookingDetails: {},
    });

    await listing.save();
    res.json({ message: "Listing created successfully", listing });
  } catch (err) {
    res.status(500).json({ error: "Failed to create listing" });
  }
});

/**
 * GET /api/listings => Get all listings
 */
app.get("/api/listings", async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

/**
 * POST /api/book/:id => Book a listing
 */
app.post("/api/book/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    listing.booked = true;
    listing.bookingDetails = req.body;
    await listing.save();

    res.json({ message: "Listing booked successfully", listing });
  } catch (err) {
    res.status(500).json({ error: "Failed to book listing" });
  }
});

/**
 * POST /api/unbook/:id => Unbook a listing
 */
app.post("/api/unbook/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    listing.booked = false;
    listing.bookingDetails = {};
    await listing.save();

    res.json({ message: "Listing unbooked successfully", listing });
  } catch (err) {
    res.status(500).json({ error: "Failed to unbook listing" });
  }
});

/**
 * PUT /api/listings/:id => Update a listing
 */
app.put("/api/listings/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, location, price, description, contact } = req.body;

    const updateData = {
      title,
      location,
      price,
      description,
      contact,
    };

    if (req.file) {
      updateData.image = req.file.filename;
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json({ message: "Listing updated successfully", listing });
  } catch (err) {
    res.status(500).json({ error: "Failed to update listing" });
  }
});

app.delete("/api/listings/:id", async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete listing" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
