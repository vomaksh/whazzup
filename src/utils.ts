import { nativeImage } from "electron";
import sharp from "sharp";

export function debounce(fn: (...args: any[]) => void, milliseconds: number) {
  let timerId: NodeJS.Timeout;

  return function (...args: any[]) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => fn.apply(this, args), milliseconds);
  };
}

export function getUnreadCountFromFavicon(faviconUrl: string) {
  const match = faviconUrl.match(
    /https:\/\/web\.whatsapp\.com\/favicon\/1x\/f(\d+)\/v4\//,
  );
  return match ? match[1] : null;
}

export async function getTrayFavicon(count: string) {
  let svg: string;
  if (count === "00") {
    svg = getFaviconSvg("99+");
  } else {
    svg = getFaviconSvg(parseInt(count).toString());
  }
  const pngBuffer = await sharp(Buffer.from(svg, "utf8")).png().toBuffer();
  return nativeImage.createFromBuffer(pngBuffer);
}

function getFaviconSvg(count: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <path
    fill="#25D366"
    d="
      M60 8
      H145
      C172 8 192 28 192 55
      V108
      C192 134 174 152 148 154
      H92
      L26 188
      L48 150
      C24 143 8 126 8 102
      V58
      C8 28 30 8 60 8
      Z
    "
  />

  <text
    x="106"
    y="87"
    text-anchor="middle"
    dominant-baseline="middle"
    fill="black"
    font-size="118"
    font-family="Arial, sans-serif"
    font-weight="bold"
  >
    ${count}
  </text>
</svg>`.trim();
}

export async function getDefaultTrayIcon() {
  const svg = getDefaultTraySvg();
  const pngBuffer = await sharp(Buffer.from(svg, "utf8")).png().toBuffer();
  return nativeImage.createFromBuffer(pngBuffer);
}

function getDefaultTraySvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <path
    fill="#25D366"
    d="
      M60 8
      H145
      C172 8 192 28 192 55
      V108
      C192 134 174 152 148 154
      H92
      L26 188
      L48 150
      C24 143 8 126 8 102
      V58
      C8 28 30 8 60 8
      Z
    "
  />

  <circle cx="72" cy="88" r="10" fill="black" />
  <circle cx="104" cy="88" r="10" fill="black" />
  <circle cx="136" cy="88" r="10" fill="black" />
</svg>`;
}

export function svgToNativeImage(svg: string) {
  const dataUrl =
    "data:image/svg+xml;base64," + Buffer.from(svg, "utf8").toString("base64");
  return nativeImage.createFromDataURL(dataUrl);
}
