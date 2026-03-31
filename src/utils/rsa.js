// RSA key utils

export async function generateRSAKeyPair() {
  return crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function exportPublicKey(publicKey) {
  const spki = await crypto.subtle.exportKey("spki", publicKey);
  return btoa(String.fromCharCode(...new Uint8Array(spki)));
}

export async function exportPrivateKey(privateKey) {
  const pkcs8 = await crypto.subtle.exportKey("pkcs8", privateKey);
  return btoa(String.fromCharCode(...new Uint8Array(pkcs8)));
}

export async function importPublicKey(base64Key) {

  // Convert base64 → ArrayBuffer
  const binary = atob(base64Key);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return crypto.subtle.importKey(
    "spki",                    // MUST be spki
    bytes.buffer,              // MUST be ArrayBuffer
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
}


export async function importPrivateKey(privateKeyBase64) {
  if (!privateKeyBase64) {
    throw new Error("Private key is required");
  }

  // Base64 → ArrayBuffer
  const binary = atob(privateKeyBase64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return crypto.subtle.importKey(
    "pkcs8",                     
    bytes.buffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"]                  // ✅ PRIVATE KEY USAGE
  );
}
