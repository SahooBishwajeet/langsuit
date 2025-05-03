require("@testing-library/jest-dom");

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  cache: (fn) => fn,
}));

// Mock Headers API
global.Headers = class {
  constructor(init) {
    this.headers = init || {};
  }

  get(name) {
    return this.headers[name] || null;
  }
};
