import { NextApiRequest, NextApiResponse } from "next";
import {
  BadRequestError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  DatabaseError,
  LanguageNotSupportedError,
  LessonNotFoundError,
} from "../../lib/errors/custom-errors";
const { errorHandler } = require("nextjs-centralized-error-handler");

interface SuccessResponse {
  message: string;
}

interface ErrorResponse {
  message: string;
  type: string;
  timestamp: string;
  path?: string;
  method?: string;
}

// Custom logger function
const customLoggerFunction = (error: Error, req: NextApiRequest) => {
  console.error({
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    query: req.query,
    body: req.body,
  });
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>,
) => {
  // Test different error scenarios based on query parameter
  const testCase = req.query.test;

  switch (testCase) {
    case "validation":
      if (!req.body.name) {
        throw new ValidationError("Name field is required");
      }
      break;
    case "auth":
      throw new UnauthorizedError("Please log in to continue");
    case "notfound":
      throw new NotFoundError("User");
    case "language":
      throw new LanguageNotSupportedError("Klingon");
    case "lesson":
      throw new LessonNotFoundError("123");
    case "database":
      throw new DatabaseError("Failed to connect to database");
    case "error":
      throw new Error("Generic error test");
  }

  res.status(200).json({ message: "Success" });
};

const options = {
  logger: customLoggerFunction,
  defaultMessage: "Something went wrong!",
  formatError: (error: Error, req: NextApiRequest) => ({
    message: error.message,
    type: error.name,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method,
  }),
};

export default errorHandler(handler, options);
