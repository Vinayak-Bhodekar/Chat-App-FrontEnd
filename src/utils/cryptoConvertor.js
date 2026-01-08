/* ===============================
   BASIC BYTE ↔ BASE64 CONVERSIONS
   =============================== */

// Uint8Array → Base64
export function uint8ToBase64(uint8) {
  return btoa(
    String.fromCharCode(...uint8)
  );
}

// Base64 → Uint8Array
export function base64ToUint8(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/* ===============================
   CRYPTOKEY EXPORT / IMPORT
   =============================== */

// Export RSA public/private key → base64
export async function exportKeyToBase64(key) {
  const format = key.type === "private" ? "pkcs8" : "spki";
  const exported = await crypto.subtle.exportKey(format, key);
  return uint8ToBase64(new Uint8Array(exported));
}

// Import RSA public key from base64
export async function importRSAPublicKey(base64Key) {
  return await crypto.subtle.importKey(
    "spki",
    base64ToUint8(base64Key),
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  );
}

// Import RSA private key from base64
export async function importRSAPrivateKey(base64Key) {
  return await crypto.subtle.importKey(
    "pkcs8",
    base64ToUint8(base64Key),
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["decrypt"]
  );
}

/* ===============================
   AES KEY EXPORT / IMPORT
   =============================== */

// Export AES key → base64
export async function exportAESKey(aesKey) {
  const raw = await crypto.subtle.exportKey("raw", aesKey);
  return uint8ToBase64(new Uint8Array(raw));
}

// Import AES key from base64
export async function importAESKey(base64Key) {
  return await crypto.subtle.importKey(
    "raw",
    base64ToUint8(base64Key),
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
}
