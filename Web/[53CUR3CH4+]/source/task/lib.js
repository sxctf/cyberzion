"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dev = exports.debug = void 0;
const dev = exports.dev = process.argv.includes('--dev');
const debug = function () {
  console.log(...arguments);
};
exports.debug = debug;