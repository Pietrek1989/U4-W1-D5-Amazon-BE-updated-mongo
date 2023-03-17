import mongoose from "mongoose";

const { Schema, model } = mongoose;

const articleSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    price: { type: Number },
    category: { type: String },
    brand: { type: String },
    // [
    //   {
    //     comment: { type: String, required: true },
    //     rate: {
    //       type: Number,
    //       required: true,
    //       min: 1,
    //       max: 5,
    //     },
    //     dateOfPosting: Date,
    //     dateOfUpdate: Date,
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

export default model("Article", articleSchema);
