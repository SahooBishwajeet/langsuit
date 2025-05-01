import mongoose, { Schema, Document } from "mongoose";

interface IFeedback extends Document {
  name: string;
  email: string;
  phone: string;
  service?: string;
  feedback?: string;
  rating: number;
  languagelearned?: string;
}

const FeedbackSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String },
    feedback: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    languagelearned: { type: String },
  },
  { timestamps: true },
);

// Check if the model already exists to avoid OverwriteModelError
const Feedback =
  mongoose.models.Feedback ||
  mongoose.model<IFeedback>("Feedback", FeedbackSchema);

export default Feedback;
