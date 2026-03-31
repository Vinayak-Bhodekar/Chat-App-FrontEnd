// utils/e2ee.js
export async function generateAESKey() {
  return crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptMessage(aesKey, plainText) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plainText);
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encoded
  );

  return {
    cipherText: Array.from(new Uint8Array(cipherBuffer)),
    iv: Array.from(iv),
  };
}

export async function decryptMessage(aesKey, cipherText, iv) {
  try {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv),
      },
      aesKey,
      new Uint8Array(cipherText)
    );
    
    return new TextDecoder().decode(decrypted);
  } catch(error) {
    throw new Error("Decryption failed",error);
  }
}
