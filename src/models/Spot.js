const mongoose = require("mongoose");

const SpotSchema = new mongoose.Schema(
  {
    thumbnail: String,
    thumbnail_url: String,
    company: String,
    price: Number,
    techs: [String],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

module.exports = mongoose.model("Spot", SpotSchema);
