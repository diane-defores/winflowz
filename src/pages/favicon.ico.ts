import type { APIRoute } from "astro";
import sharp from "sharp";
import ico from "sharp-ico";
import path from "node:path";

export async function GET() {
  const faviconSrc = path.resolve("public/images/WinFlowz.png");
  
  // D'abord, convertir en PNG 32x32
  const pngBuffer = await sharp(faviconSrc)
    .resize(32, 32)
    .png()
    .toBuffer();

  // Ensuite, convertir le PNG en ICO
  const icoBuffer = ico.encode([pngBuffer]);

  return new Response(icoBuffer, {
    headers: {
      'Content-Type': 'image/x-icon'
    }
  });
}
