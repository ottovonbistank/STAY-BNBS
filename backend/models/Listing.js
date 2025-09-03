import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: String,
  location: String,
  price: String,
  description: String,
  contact: String,
  booked: { type: Boolean, default: false },
  bookingDetails: { nights: Number },
  imageUrl: String,  // ✅ single image field (used by frontend)
  seller: { type: String }
});

export default mongoose.model("Listing", listingSchema);
