import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: String,
  location: String,
  price: String,
  description: String,
  contact: String,                       // ✅ <-- new field
  booked: { type: Boolean, default: false },
  bookingDetails: { nights: Number },
  image: String,         // filename
  imageUrl: String,      // full path for frontend
  seller: { type: String }
});

export default mongoose.model("Listing", listingSchema);
