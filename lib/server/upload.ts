import { extname } from "path";

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const VIDEO_TYPES: Record<string, string> = {
  "video/webm": ".webm",
  "video/mp4": ".mp4",
  "video/quicktime": ".mov",
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;

function sniffImageExt(buf: Buffer): string | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return ".jpg";
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return ".png";
  }
  if (
    buf.length >= 12 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    return ".webp";
  }
  if (
    buf.length >= 6 &&
    (buf.toString("ascii", 0, 6) === "GIF87a" || buf.toString("ascii", 0, 6) === "GIF89a")
  ) {
    return ".gif";
  }
  return null;
}

function sniffVideoExt(buf: Buffer): string | null {
  if (buf.length >= 4 && buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) {
    return ".webm";
  }
  if (buf.length >= 12 && buf.toString("ascii", 4, 8) === "ftyp") return ".mp4";
  return null;
}

export type ValidatedUpload =
  | { ok: true; buffer: Buffer; ext: string }
  | { ok: false; message: string };

export async function validateImageUpload(file: File): Promise<ValidatedUpload> {
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, message: "Image must be 5MB or smaller" };
  }
  const mime = (file.type || "").toLowerCase();
  if (!IMAGE_TYPES[mime]) {
    return { ok: false, message: "Only JPEG, PNG, WebP, or GIF images are allowed" };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const magicExt = sniffImageExt(buffer);
  if (!magicExt || !Object.values(IMAGE_TYPES).includes(magicExt)) {
    return { ok: false, message: "File content does not match an allowed image type" };
  }
  const clientExt = extname(file.name || "").toLowerCase();
  if (clientExt && ![".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(clientExt)) {
    return { ok: false, message: "Unsafe file extension" };
  }
  return { ok: true, buffer, ext: magicExt };
}

export async function validateVideoUpload(file: File): Promise<ValidatedUpload> {
  if (file.size > MAX_VIDEO_BYTES) {
    return { ok: false, message: "Video must be 25MB or smaller" };
  }
  const mime = (file.type || "").toLowerCase();
  if (!VIDEO_TYPES[mime]) {
    return { ok: false, message: "Only WebM, MP4, or QuickTime videos are allowed" };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const magicExt = sniffVideoExt(buffer);
  if (!magicExt) {
    return { ok: false, message: "File content does not match an allowed video type" };
  }
  const ext =
    mime === "video/webm" ? ".webm" : mime === "video/quicktime" ? ".mov" : ".mp4";
  return { ok: true, buffer, ext };
}
