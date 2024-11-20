import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';
import { dev, debug } from './lib';

const browserLauncher = puppeteer.launch();

const flagFile = dev ? '../task/flag.txt' : './flag.txt';
const flag = fs.readFileSync(path.resolve(__dirname, flagFile), 'utf8').trim();

export const inspect = async url => {
    try {
        const browser = await browserLauncher;
        const page = await browser.newPage();

        await page.setCookie({ httpOnly: true, name: 'flag', url, value: flag });

        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 3000
        });

        const [title, description] = await page.evaluate(() => {
            const description = document.querySelector(
                'meta[name=description],meta[property="og:description"]'
            );

            return [document.title || '', description?.getAttribute('content') || ''];
        });

        await page.close();

        return { title, description };
    } catch (err) {
        debug(err);
    }

    return null;
};
