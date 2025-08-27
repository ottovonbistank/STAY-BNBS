import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
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

// ✅ M-Pesa Token
async function getAccessToken() {
  const secret = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const { data } = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${secret}`,
      },
    }
  );

  return data.access_token;
}

// ✅ STK Push
app.post("/api/mpesa/stkpush", async (req, res) => {
  try {
    const { phone, amount, listingId } = req.body;
    const token = await getAccessToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: `${process.env.SERVER_URL}/api/mpesa/callback`,
        AccountReference: listingId,
        TransactionDesc: "Payment for booking",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json({ success: true, message: "STK Push sent" });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "STK push failed" });
  }
});

// ✅ M-Pesa Callback
app.post("/api/mpesa/callback", async (req, res) => {
  console.log("M-Pesa Callback:", req.body);

  try {
    const body = req.body.Body.stkCallback;

    if (body.ResultCode === 0) {
      const listingId = body.CallbackMetadata.Item.find(
        (i) => i.Name === "AccountReference"
      )?.Value;

      if (listingId) {
        await Listing.findByIdAndUpdate(listingId, { booked: true });
        console.log("Booking marked as paid:", listingId);
      }
    }
  } catch (err) {
    console.error("Callback error:", err.message);
  }

  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

mongoose.connection.once("open", () => {
  console.log("✅ Connected to DB:", mongoose.connection.name);
  console.log("✅ Collections:", Object.keys(mongoose.connection.collections));
});
