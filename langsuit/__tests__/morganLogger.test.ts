import { morgan } from "@/utils/morganLogger";

// Mock Request class
class MockRequest {
  public url: string;
  public method: string;
  public headers: Headers;

  constructor(url: string, init?: RequestInit) {
    this.url = url;
    this.method = init?.method || "GET";
    this.headers = new Headers(init?.headers);
  }
}

describe("Morgan Logger", () => {
  let mockRequest: MockRequest;
  let mockConsoleLog: jest.SpyInstance;
  let mockStream: { write: jest.Mock };

  beforeEach(() => {
    mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {});
    mockStream = { write: jest.fn() };
    mockRequest = new MockRequest("http://localhost:3000/test", {
      method: "GET",
      headers: {
        "user-agent": "test-agent",
        referer: "http://localhost:3000",
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Helper function to strip ANSI color codes
  const stripAnsi = (str: string) => str.replace(/\x1B\[\d+m/g, "");

  // Helper function to clean log line (strip colors and line endings)
  const cleanLogLine = (str: string) => stripAnsi(str.replace(/[\r\n]+$/, ""));

  describe("Format: tiny", () => {
    it("should format logs in tiny format", async () => {
      const logger = morgan({ format: "tiny" });
      await logger(mockRequest as unknown as Request);

      const logLine = cleanLogLine(mockConsoleLog.mock.calls[0][0]);
      expect(logLine).toBe("GET /test 200");
    });
  });

  describe("Format: dev", () => {
    it("should format logs in dev format with colors", async () => {
      const logger = morgan({ format: "dev" });
      await logger(mockRequest as unknown as Request);

      const calls = mockConsoleLog.mock.calls;
      expect(calls.length).toBe(1);
      const logLine = cleanLogLine(calls[0][0]);
      expect(logLine).toBe("GET /test 200");
    });

    it("should use different colors for different HTTP methods", async () => {
      const methods = ["GET", "POST", "DELETE", "PUT"];
      const logger = morgan({ format: "dev" });

      for (const method of methods) {
        mockRequest = new MockRequest("http://localhost:3000/test", {
          method: method,
          headers: {
            "user-agent": "test-agent",
            referer: "http://localhost:3000",
          },
        });
        await logger(mockRequest as unknown as Request);
        const logLine = cleanLogLine(
          mockConsoleLog.mock.calls[mockConsoleLog.mock.calls.length - 1][0]
        );
        expect(logLine).toBe(`${method} /test 200`);
      }

      expect(mockConsoleLog).toHaveBeenCalledTimes(4);
    });

    it("should use different colors for different status codes", async () => {
      const logger = morgan({ format: "dev" });
      const statusCodes = [200, 300, 400, 500];

      for (const status of statusCodes) {
        mockRequest = new MockRequest("http://localhost:3000/test", {
          method: "GET",
          headers: {
            "user-agent": "test-agent",
            referer: "http://localhost:3000",
          },
        });
        await logger(mockRequest as unknown as Request);
        const logLine = cleanLogLine(
          mockConsoleLog.mock.calls[mockConsoleLog.mock.calls.length - 1][0]
        );
        expect(logLine).toBe("GET /test 200");
      }

      expect(mockConsoleLog).toHaveBeenCalledTimes(4);
    });
  });

  describe("Format: common", () => {
    it("should format logs in common format", async () => {
      const logger = morgan({ format: "common" });
      await logger(mockRequest as unknown as Request);

      const logLine = cleanLogLine(mockConsoleLog.mock.calls[0][0]);
      expect(logLine).toMatch(/GET \/test 200 - test-agent/);
    });
  });

  describe("Format: combined", () => {
    it("should format logs in combined format", async () => {
      const logger = morgan({ format: "combined" });
      await logger(mockRequest as unknown as Request);

      const logLine = cleanLogLine(mockConsoleLog.mock.calls[0][0]);
      expect(logLine).toMatch(
        /GET \/test 200 - test-agent http:\/\/localhost:3000/
      );
    });
  });

  describe("Format: short", () => {
    it("should format logs in short format", async () => {
      const logger = morgan({ format: "short" });
      await logger(mockRequest as unknown as Request);

      const logLine = cleanLogLine(mockConsoleLog.mock.calls[0][0]);
      expect(logLine).toMatch(/GET \/test HTTP\/1\.1 200/);
    });
  });

  describe("Custom stream", () => {
    it("should use custom stream when provided", async () => {
      const logger = morgan({ format: "tiny", stream: mockStream });
      await logger(mockRequest as unknown as Request);

      expect(mockStream.write).toHaveBeenCalled();
      expect(mockConsoleLog).not.toHaveBeenCalled();
    });
  });

  describe("Default options", () => {
    it("should use dev format by default", async () => {
      const logger = morgan();
      await logger(mockRequest as unknown as Request);

      const logLine = cleanLogLine(mockConsoleLog.mock.calls[0][0]);
      expect(logLine).toBe("GET /test 200");
    });
  });

  describe("Invalid format", () => {
    it("should fall back to dev format for invalid format string", async () => {
      const logger = morgan({ format: "invalid-format" as any });
      await logger(mockRequest as unknown as Request);

      const logLine = cleanLogLine(mockConsoleLog.mock.calls[0][0]);
      expect(logLine).toBe("GET /test 200");
    });
  });
});
