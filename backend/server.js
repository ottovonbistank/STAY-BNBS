import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import Listing from "./models/Listing.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ✅ Serve static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// ✅ Get all listings
app.get("/api/listings", async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

// ✅ Get single listing
app.get("/api/listings/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Not found" });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch listing" });
  }
});

// ✅ Create new listing
app.post("/api/listings", async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    await newListing.save();
    res.status(201).json(newListing);
  } catch (err) {
    res.status(500).json({ error: "Failed to create listing" });
  }
});

// ✅ Update listing
app.put("/api/listings/:id", async (req, res) => {
  try {
    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update listing" });
  }
});

// ✅ Delete listing
app.delete("/api/listings/:id", async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete listing" });
  }
});

// ✅ Book a listing (no M-Pesa, just toggle booked)
app.post("/api/listings/:id/book", async (req, res) => {
  try {
    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      { booked: true },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to book listing" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

mongoose.connection.once("open", () => {
  console.log("✅ Connected to DB:", mongoose.connection.name);
  console.log("✅ Collections:", Object.keys(mongoose.connection.collections));
});
