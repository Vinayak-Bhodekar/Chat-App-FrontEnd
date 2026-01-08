export async function generateAESKey() {
  return crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function exportAESKey(key) {
  const raw = await crypto.subtle.exportKey("raw", key);
  return Array.from(new Uint8Array(raw));
}

export async function importAESKey(raw) {
  return crypto.subtle.importKey(
    "raw",
    new Uint8Array(raw),
    "AES-GCM",
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptMessage(aesKey, message) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(message);

  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encoded
  );

  return {
    cipherText: Array.from(new Uint8Array(cipher)),
    iv: Array.from(iv),
  };
}

export async function decryptMessage(aesKey, cipherText, iv) {
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    aesKey,
    new Uint8Array(cipherText)
  );

  return new TextDecoder().decode(decrypted);
}


export async function encryptAESKeyWithRSA(aesKey, rsaPublicKey) {
  const rawAES = await crypto.subtle.exportKey("raw", aesKey);
  console.log(rawAES)
  const encrypted = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    rsaPublicKey,
    rawAES
  );

  return Array.from(new Uint8Array(encrypted));
}


export async function decryptAESKeyWithRSA(encryptedAES, rsaPrivateKey) {
  const decrypted = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    rsaPrivateKey,
    new Uint8Array(encryptedAES)
  );

  return crypto.subtle.importKey(
    "raw",
    decrypted,
    "AES-GCM",
    true,
    ["encrypt", "decrypt"]
  );
}
