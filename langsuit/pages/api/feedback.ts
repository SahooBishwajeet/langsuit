import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/mongodb";
import Feedback from "../../models/feedback";
import { validateCsrfToken } from "@/lib/csrf";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!validateCsrfToken(req)) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  await dbConnect();
  if (req.method === "POST") {
    try {
      const { name, email, phone, service, feedback, rating, languagelearned } =
        req.body;
      if (!name || !email || !phone || !rating) {
        return res
          .status(400)
          .json({ message: "Name, email, phone, and rating are required!" });
      }
      const newFeedback = new Feedback({
        name,
        email,
        phone,
        service,
        feedback,
        rating,
        languagelearned,
      });
      await newFeedback.save();
      return res
        .status(201)
        .json({ message: "Feedback submitted successfully!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error saving feedback", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
export default handler;
