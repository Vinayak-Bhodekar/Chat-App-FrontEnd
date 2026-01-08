if (!window.__AES_KEY__) {
  window.__AES_KEY__ = null;
}

export async function initAES() {
  if (!window.__AES_KEY__) {
    window.__AES_KEY__ = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }
}

function uint8ToBase64(u8) {
  return btoa(String.fromCharCode(...u8));
}

function base64ToUint8(b64) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

export async function encryptMessage(message) {
  const key = window.__AES_KEY__;
  if (!key) throw new Error("AES not initialized");

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(message);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  return {
    cipherText: uint8ToBase64(new Uint8Array(encrypted)),
    iv: uint8ToBase64(iv),
  };
}

export async function decryptMessage(cipherText, iv) {
  const key = window.__AES_KEY__;
  if (!key) throw new Error("AES not initialized");

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: base64ToUint8(iv),
    },
    key,
    base64ToUint8(cipherText)
  );

  return new TextDecoder().decode(decrypted);
}

export function debugAES() {
  console.log("AES KEY:", aesKey);
}
