import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const transparentSvg = readFileSync(path.join(root, "assets/images/logo-mark.svg"));
const solidSvg = readFileSync(path.join(root, "assets/images/icon-solid.svg"));

const targets = [
  { svg: transparentSvg, size: 16, out: "static/favicon-16x16.png" },
  { svg: transparentSvg, size: 32, out: "static/favicon-32x32.png" },
  { svg: solidSvg, size: 180, out: "static/apple-touch-icon.png" },
  { svg: solidSvg, size: 192, out: "static/android-chrome-192x192.png" },
  { svg: solidSvg, size: 512, out: "static/android-chrome-512x512.png" },
];

for (const t of targets) {
  await sharp(t.svg, { density: 384 })
    .resize(t.size, t.size)
    .png()
    .toFile(path.join(root, t.out));
  console.log(`generated ${t.out}`);
}

const manifest = {
  name: "MyBearIsYellow",
  short_name: "MyBearIsYellow",
  icons: [
    { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
  ],
  theme_color: "#0B1220",
  background_color: "#0B1220",
  display: "standalone",
};
writeFileSync(path.join(root, "static/site.webmanifest"), JSON.stringify(manifest, null, 2));
console.log("generated static/site.webmanifest");
