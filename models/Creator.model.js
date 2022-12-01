import { Schema, model } from "mongoose";

const creatorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minLength: 2,
      maxLength: 40,
      lowercase: true,
    },
    bio: {
      type: String,
    },
    age: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    },
    isChef: {
      type: Boolean,
      default: false,
    },
    recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
  },
  {
    timestamps: true,
  }
);

const CreatorModel = model("Creator", creatorSchema);

export default CreatorModel;