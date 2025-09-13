import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: { type: String },
  team: { type: String },
  age: { type: Number },
  photo: { type: String },   // ✅ add this field for player image
  sentimentScore: { type: Number },
  stats: { type: Object }, // raw performance stats
  predictions: [
    {
      date: { type: Date, default: Date.now },
      value: { type: Number },
    }
  ]
});

export default mongoose.model("Player", playerSchema);
