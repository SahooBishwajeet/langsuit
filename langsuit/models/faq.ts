import mongoose from "mongoose";
export interface IFAQ extends Document {
  question: string;
  answer: string;
}
const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});
export default mongoose.models.FAQ || mongoose.model("FAQ", faqSchema);
