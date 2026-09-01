/**
 * Multi-layer Security Vault for sensitive data (Google Sheets Web App URL & Admin Credentials)
 * Uses multi-pass obfuscation, dynamic salted XOR cipher, base64url transcoding, and HMAC-like checksums.
 */

const VAULT_SALT_LAYER_1 = "FAHNOTES_SECURE_VAULT_2026_LAYER1_ALPHA";
const VAULT_SALT_LAYER_2 = "9982_GSHEET_RESTRICTED_ACCESS_LAYER2_OMEGA";

/**
 * Generate a dynamic key based on salt and input length
 */
function deriveDynamicKey(salt: string, len: number): number[] {
  const key: number[] = [];
  for (let i = 0; i < len; i++) {
    const charCode = salt.charCodeAt(i % salt.length);
    key.push((charCode * 31 + (i % 17) * 13) % 256);
  }
  return key;
}

/**
 * Calculate simple 32-bit checksum hash
 */
function calculateChecksum(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return (hash >>> 0).toString(16);
}

/**
 * Layer 1 & 2: Multi-pass XOR & Transposition
 */
function encryptLayeredPass(plain: string): string {
  if (!plain) return "";
  const dynamicKey1 = deriveDynamicKey(VAULT_SALT_LAYER_1, plain.length);
  const dynamicKey2 = deriveDynamicKey(VAULT_SALT_LAYER_2, plain.length);

  // Pass 1: XOR with Key 1
  const pass1: number[] = [];
  for (let i = 0; i < plain.length; i++) {
    pass1.push(plain.charCodeAt(i) ^ dynamicKey1[i]);
  }

  // Pass 2: Inverted transposition + XOR with Key 2
  const pass2: number[] = [];
  const len = pass1.length;
  for (let i = 0; i < len; i++) {
    const byte = pass1[len - 1 - i];
    pass2.push(byte ^ dynamicKey2[i]);
  }

  // Pass 3: Hex/Base64 encoding with prefix
  const hexStr = pass2.map(b => b.toString(16).padStart(2, "0")).join("");
  const b64 = btoa(hexStr);
  const checksum = calculateChecksum(plain);

  return `VAULT_L3:${checksum}:${b64}`;
}

/**
 * Decrypt multi-pass secure string
 */
function decryptLayeredPass(cipherText: string): string {
  if (!cipherText || !cipherText.startsWith("VAULT_L3:")) {
    // If not encrypted in new format, return as-is (graceful fallback)
    return cipherText;
  }

  try {
    const parts = cipherText.split(":");
    if (parts.length < 3) return "";
    const expectedChecksum = parts[1];
    const b64 = parts.slice(2).join(":");

    const hexStr = atob(b64);
    const pass2: number[] = [];
    for (let i = 0; i < hexStr.length; i += 2) {
      pass2.push(parseInt(hexStr.substring(i, i + 2), 16));
    }

    const len = pass2.length;
    const dynamicKey2 = deriveDynamicKey(VAULT_SALT_LAYER_2, len);
    const dynamicKey1 = deriveDynamicKey(VAULT_SALT_LAYER_1, len);

    // Revert Pass 2
    const pass1Reversed: number[] = [];
    for (let i = 0; i < len; i++) {
      pass1Reversed.push(pass2[i] ^ dynamicKey2[i]);
    }

    // Revert transposition
    const pass1: number[] = new Array(len);
    for (let i = 0; i < len; i++) {
      pass1[len - 1 - i] = pass1Reversed[i];
    }

    // Revert Pass 1
    const chars: string[] = [];
    for (let i = 0; i < len; i++) {
      chars.push(String.fromCharCode(pass1[i] ^ dynamicKey1[i]));
    }

    const plain = chars.join("");
    if (calculateChecksum(plain) !== expectedChecksum) {
      console.warn("Vault checksum mismatch, returning decrypted anyway.");
    }
    return plain;
  } catch (err) {
    console.error("Failed to decrypt secure vault item:", err);
    return "";
  }
}

/**
 * Mask sensitive URL for clean display:
 * e.g. https://script.google.com/macros/s/AKfycby.../exec -> https://script.google.com/macros/s/AKfyc••••••••••••/exec
 */
export function maskSensitiveUrl(url: string): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split("/");
    const execPart = pathParts[pathParts.length - 1];
    const macroId = pathParts[pathParts.length - 2] || "";
    if (macroId.length > 8) {
      const prefix = macroId.substring(0, 6);
      const maskedPath = `/macros/s/${prefix}${"•".repeat(16)}/${execPart}`;
      return `${parsed.protocol}//${parsed.host}${maskedPath}`;
    }
    return `${parsed.protocol}//${parsed.host}/macros/s/${"•".repeat(16)}/exec`;
  } catch {
    if (url.length > 20) {
      return url.substring(0, 15) + "••••••••••••••••" + url.substring(url.length - 5);
    }
    return "••••••••••••••••";
  }
}

/**
 * Encrypt arbitrary object / sensitive string
 */
export function encryptVaultData(data: unknown): string {
  const json = typeof data === "string" ? data : JSON.stringify(data);
  return encryptLayeredPass(json);
}

/**
 * Decrypt vault string to object / string
 */
export function decryptVaultData<T = unknown>(encryptedStr: string, defaultValue: T): T {
  if (!encryptedStr) return defaultValue;
  if (!encryptedStr.startsWith("VAULT_L3:")) {
    try {
      return JSON.parse(encryptedStr) as T;
    } catch {
      return (encryptedStr as unknown) as T;
    }
  }

  const decrypted = decryptLayeredPass(encryptedStr);
  if (!decrypted) return defaultValue;

  try {
    return JSON.parse(decrypted) as T;
  } catch {
    return (decrypted as unknown) as T;
  }
}
