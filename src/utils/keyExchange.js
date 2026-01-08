export async function encryptAESWithRSA(aesRaw, publicKey) {
  const encrypted = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    new Uint8Array(aesRaw)
  );
  return Array.from(new Uint8Array(encrypted));
}

export async function decryptAESWithRSA(encryptedAES, privateKey) {
  const decrypted = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    new Uint8Array(encryptedAES)
  );
  return Array.from(new Uint8Array(decrypted));
}
