import mongoose from "mongoose";
import { type } from "os";

const applicationSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  company: { type: String },
  jobDescription: { type: String },
  score: { type: Number },
  matchedKeywords: [String],
  missingKeywords: [String],
  suggestions: [String],
  summary: { type: String },
  cacheKey:{type:String},
  resumeText:{type:String},
  status: {
    type: String,
    enum: ["Applied", "Interview", "Rejected", "Offer"],
    default: "Applied",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Application", applicationSchema);
