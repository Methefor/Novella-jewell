// Tests must never connect to the store database or send transactional email.
process.env.DATABASE_URL = '';
process.env.RESEND_API_KEY = '';
const Module = require('node:module');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  if (name === 'server-only') return require.resolve('./server-only.cjs');
  return resolve.call(this, name, ...args);
};
