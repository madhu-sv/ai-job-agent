// jest.setup.cjs

// 1) React-DOM custom matchers
require('@testing-library/jest-dom');

// 2) Polyfill fetch and its classes for Node
const fetch = require('node-fetch');
const { Request, Response, Headers } = fetch;

// Attach to the global scope
global.fetch = fetch;
global.Request = Request;
global.Response = Response;
global.Headers = Headers;
