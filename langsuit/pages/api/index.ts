import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/mongodb";
import FAQ, { IFAQ } from "../../models/faq";
interface ErrorResponse {
  success: false;
  error: string;
}
interface SuccessResponse {
  success: true;
  data: IFAQ[];
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>,
) {
  const { method } = req;
  await dbConnect();
  switch (method) {
    case "GET":
      try {
        const faqs: IFAQ[] = await FAQ.find({});
        if (!faqs || faqs.length === 0) {
          return res
            .status(404)
            .json({ success: false, error: "No FAQs found" });
        }
        return res.status(200).json({ success: true, data: faqs });
      } catch (error) {
        return res
          .status(500)
          .json({ success: false, error: (error as any).message });
      }
    default:
      return res
        .status(405)
        .json({ success: false, error: "Method not allowed" });
  }
}
