"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inspect = void 0;
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _nodePath = _interopRequireDefault(require("node:path"));
var _puppeteer = _interopRequireDefault(require("puppeteer"));
var _lib = require("./lib");
const browserLauncher = _puppeteer.default.launch();
const flagFile = _lib.dev ? '../task/flag.txt' : './flag.txt';
const flag = _nodeFs.default.readFileSync(_nodePath.default.resolve(__dirname, flagFile), 'utf8').trim();
const inspect = async url => {
  try {
    const browser = await browserLauncher;
    const page = await browser.newPage();
    await page.setCookie({
      httpOnly: true,
      name: 'flag',
      url,
      value: flag
    });
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 3000
    });
    const [title, description] = await page.evaluate(() => {
      const description = document.querySelector('meta[name=description],meta[property="og:description"]');
      return [document.title || '', description?.getAttribute('content') || ''];
    });
    await page.close();
    return {
      title,
      description
    };
  } catch (err) {
    (0, _lib.debug)(err);
  }
  return null;
};
exports.inspect = inspect;