// Prints /cv to public/Rizwan-Mahmood-CV.pdf, so the download always
// matches the page. Run with the dev server up: npm run cv:pdf
// (CV_URL overrides the address, e.g. a preview deployment).
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const url = process.env.CV_URL ?? "http://localhost:3005/cv";
const out = fileURLToPath(new URL("../public/Rizwan-Mahmood-CV.pdf", import.meta.url));

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.emulateMedia({ media: "print" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: out, format: "A4", printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log(`Wrote ${out}`);
