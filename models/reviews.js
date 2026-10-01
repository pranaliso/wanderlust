// reviews.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true }, // <-- add this
  createdAt: { type: Date, default: Date.now }
});

// Export model as "Reviews" to match Listing ref
module.exports = mongoose.model("Reviews", reviewSchema);
