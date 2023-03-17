import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewsSchema = new Schema(
  {
    comment: { type: String, required: true },
    rate: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    productId: { type: Schema.Types.ObjectId, ref: "Article" },
  },

  { timestamps: true }
);

export default model("Review", reviewsSchema);
