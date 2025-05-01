type LogFormat = "tiny" | "dev" | "common" | "combined" | "short" | string;

interface LoggerOptions {
  format?: LogFormat;
  stream?: {
    write: (message: string) => void;
  };
}

const colors = {
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
};

const statusColors: { [key: number]: string } = {
  500: colors.red,
  400: colors.yellow,
  300: colors.cyan,
  200: colors.green,
};

const formatters = {
  tiny: (request: Request, responseStatus = 200): string => {
    const method = request.method;
    const url = new URL(request.url).pathname;
    return `${method} ${url} ${responseStatus}`;
  },

  dev: (request: Request, responseStatus = 200): string => {
    const method = request.method;
    const url = new URL(request.url).pathname;
    const statusColor =
      statusColors[Math.floor(responseStatus / 100) * 100] || colors.reset;
    const methodColor =
      method === "GET"
        ? colors.blue
        : method === "POST"
          ? colors.green
          : method === "DELETE"
            ? colors.red
            : method === "PUT"
              ? colors.yellow
              : colors.reset;

    return `${methodColor}${method}${colors.reset} ${url} ${statusColor}${responseStatus}${colors.reset}`;
  },

  common: (request: Request, responseStatus = 200): string => {
    const timestamp = new Date().toISOString();
    const method = request.method;
    const url = new URL(request.url).pathname;
    const userAgent = request.headers.get("user-agent") || "-";
    return `${timestamp} ${method} ${url} ${responseStatus} - ${userAgent}`;
  },

  combined: (request: Request, responseStatus = 200): string => {
    const timestamp = new Date().toISOString();
    const method = request.method;
    const url = new URL(request.url).pathname;
    const userAgent = request.headers.get("user-agent") || "-";
    const referer = request.headers.get("referer") || "-";
    return `${timestamp} ${method} ${url} ${responseStatus} - ${userAgent} ${referer}`;
  },

  short: (request: Request, responseStatus = 200): string => {
    const method = request.method;
    const url = new URL(request.url).pathname;
    return `${method} ${url} HTTP/1.1 ${responseStatus}`;
  },
};

export const morgan = (options: LoggerOptions = {}) => {
  const format = options.format || "dev";
  const stream = options.stream || {
    write: (message: string) => console.log(message),
  };

  return async (request: Request) => {
    const formatter =
      typeof format === "string" && format in formatters
        ? formatters[format as keyof typeof formatters]
        : formatters.dev;

    const logMessage = formatter(request);
    stream.write(`${logMessage}\n`);
  };
};

export default morgan;
