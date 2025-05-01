// Base API Error class
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Validation Errors (400)
export class BadRequestError extends ApiError {
  constructor(message: string) {
    super(400, message);
    this.name = "BadRequestError";
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(400, message);
    this.name = "ValidationError";
  }
}

// Authentication Errors (401)
export class UnauthorizedError extends ApiError {
  constructor(message: string = "Authentication required") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}

export class TokenExpiredError extends ApiError {
  constructor(message: string = "Token has expired") {
    super(401, message);
    this.name = "TokenExpiredError";
  }
}

// Authorization Errors (403)
export class ForbiddenError extends ApiError {
  constructor(message: string = "Access forbidden") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

// Resource Errors (404)
export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
    this.name = "NotFoundError";
  }
}

// Database Errors (500)
export class DatabaseError extends ApiError {
  constructor(message: string = "Database operation failed") {
    super(500, message);
    this.name = "DatabaseError";
  }
}

// Rate Limiting Errors (429)
export class RateLimitError extends ApiError {
  constructor(message: string = "Too many requests") {
    super(429, message);
    this.name = "RateLimitError";
  }
}

// Business Logic Errors (422)
export class BusinessLogicError extends ApiError {
  constructor(message: string) {
    super(422, message);
    this.name = "BusinessLogicError";
  }
}

// Language-specific Errors (for your language learning app)
export class LanguageNotSupportedError extends ApiError {
  constructor(language: string) {
    super(400, `Language '${language}' is not supported`);
    this.name = "LanguageNotSupportedError";
  }
}

export class LessonNotFoundError extends ApiError {
  constructor(lessonId: string) {
    super(404, `Lesson with ID '${lessonId}' not found`);
    this.name = "LessonNotFoundError";
  }
}

export class ProgressTrackingError extends ApiError {
  constructor(message: string) {
    super(500, `Progress tracking failed: ${message}`);
    this.name = "ProgressTrackingError";
  }
}

export class QuizCompletionError extends ApiError {
  constructor(message: string) {
    super(422, `Quiz completion failed: ${message}`);
    this.name = "QuizCompletionError";
  }
}
