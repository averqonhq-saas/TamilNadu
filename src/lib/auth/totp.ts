import crypto from "crypto";
import QRCode from "qrcode";

const ENCRYPTION_SECRET = process.env.ADMIN_2FA_ENCRYPTION_KEY || "btn-admin-2fa-aes-256-gcm-secret-key-32b!";

// =============================================
// 1. BASE32 ENCODING / DECODING (RFC 4648)
// =============================================
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

export function base32Decode(input: string): Buffer {
  const cleanInput = input.toUpperCase().replace(/=+$/, "").replace(/[^A-Z2-7]/g, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < cleanInput.length; i++) {
    const idx = ALPHABET.indexOf(cleanInput[i]);
    if (idx === -1) continue;

    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

// =============================================
// 2. RFC 6238 TOTP ALGORITHM
// =============================================
export function generateTOTPSecret(): string {
  const buffer = crypto.randomBytes(20); // 160 bits secret
  return base32Encode(buffer);
}

export function generateTOTP(secretBase32: string, timeStep = 30, timeOffset = 0): string {
  const key = base32Decode(secretBase32);
  const now = Math.floor(Date.now() / 1000) + timeOffset;
  const counter = Math.floor(now / timeStep);

  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(counter), 0);

  const hmac = crypto.createHmac("sha1", key).update(buffer).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;

  const codeInt =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const code = (codeInt % 1000000).toString().padStart(6, "0");
  return code;
}

export function verifyTOTP(secretBase32: string, token: string, window = 2): boolean {
  const cleanToken = token.replace(/\s+/g, "").trim();
  if (!/^\d{6}$/.test(cleanToken)) return false;

  for (let errorWindow = -window; errorWindow <= window; errorWindow++) {
    const expected = generateTOTP(secretBase32, 30, errorWindow * 30);
    if (crypto.timingSafeEqual(Buffer.from(cleanToken), Buffer.from(expected))) {
      return true;
    }
  }

  return false;
}

export function generateOtpauthUri(email: string, secretBase32: string): string {
  const issuer = "Build Tamil Nadu";
  const label = `${issuer}:${email.trim()}`;
  return `otpauth://totp/${encodeURIComponent(label)}?secret=${secretBase32}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}

// =============================================
// 3. AES-256-GCM SECRET ENCRYPTION
// =============================================
function get32ByteKey(): Buffer {
  return crypto.createHash("sha256").update(ENCRYPTION_SECRET).digest();
}

export function encryptSecret(plainTextSecret: string): string {
  const key = get32ByteKey();
  const iv = crypto.randomBytes(12); // 96-bit IV for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(plainTextSecret, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  // Format: iv:encrypted:authTag
  return `${iv.toString("hex")}:${encrypted}:${authTag}`;
}

export function decryptSecret(encryptedPayload: string): string {
  const key = get32ByteKey();
  const parts = encryptedPayload.split(":");
  if (parts.length !== 3) throw new Error("Invalid encrypted payload format");

  const [ivHex, encryptedHex, authTagHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

// =============================================
// 4. ONE-TIME RECOVERY CODES
// =============================================
export interface FormattedRecoveryCode {
  code: string; // e.g. "A7K9M-3P2X8"
  code_hash: string;
}

export function hashRecoveryCode(code: string): string {
  const clean = code.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  return crypto.createHmac("sha256", ENCRYPTION_SECRET).update(clean).digest("hex");
}

export function generateRecoveryCodes(count = 8): { formattedCodes: string[]; hashedCodes: Array<{ code_hash: string; used: boolean; used_at: string | null }> } {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // readable 32-char set
  const formattedCodes: string[] = [];
  const hashedCodes: Array<{ code_hash: string; used: boolean; used_at: string | null }> = [];

  for (let i = 0; i < count; i++) {
    let part1 = "";
    let part2 = "";
    const rand = crypto.randomBytes(10);
    for (let j = 0; j < 5; j++) part1 += chars[rand[j] % chars.length];
    for (let j = 5; j < 10; j++) part2 += chars[rand[j] % chars.length];

    const code = `${part1}-${part2}`;
    formattedCodes.push(code);
    hashedCodes.push({
      code_hash: hashRecoveryCode(code),
      used: false,
      used_at: null,
    });
  }

  return { formattedCodes, hashedCodes };
}

// =============================================
// 5. VECTOR SVG QR CODE GENERATOR (USING QRCODE PACKAGE)
// =============================================
export async function generateSVGQRCode(text: string): Promise<string> {
  return await QRCode.toString(text, {
    type: "svg",
    margin: 2,
    color: {
      dark: "#0f172a",
      light: "#ffffff",
    },
  });
}
