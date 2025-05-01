import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/mongodb";
import Language, { ILanguage } from "../../models/language";

interface ErrorResponse {
  success: false;
  error: string;
}

interface SuccessResponse {
  success: true;
  data: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>,
) {
  const { method } = req;
  const lang = req.query.lang as string;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const language: ILanguage | null = await Language.findOne({
          language: { $regex: new RegExp("^" + lang + "$", "i") },
        });
        if (!language) {
          return res
            .status(404)
            .json({ success: false, error: "Language not found" });
        }
        // console.log(language);
        res.status(200).json({ success: true, data: language });
      } catch (error) {
        res
          .status(400)
          .json({ success: false, error: (error as Error).message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: "Invalid method" });
      break;
  }
}
