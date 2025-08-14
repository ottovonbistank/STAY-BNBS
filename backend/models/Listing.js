import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: String,
  location: String,
  price: String,
  description: String,
  booked: { type: Boolean, default: false },
  bookingDetails: { nights: Number },
  image: String, // store filename
  seller: { type: String }, // seller ID
});

export default mongoose.model("Listing", listingSchema);
