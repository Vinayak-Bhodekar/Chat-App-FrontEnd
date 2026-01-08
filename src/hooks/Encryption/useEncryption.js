import {
  encryptMessage,
  decryptMessage,
  generateAESKey,
  exportAESKey,
  importAESKey,
} from "../../utils/aes.js";

import {
  encryptAESWithRSA,
  decryptAESWithRSA,
} from "../../utils/keyExchange";

const roomKeys = new Map();

export default function useEncryption() {
  async function setupRoomKey(roomId, receiverPublicKey, encryptedFromServer, myPrivateKey) {

    // 🔁 If key already in memory
    if (roomKeys.has(roomId)) return;

    // 🔐 If AES key already exists on server
    if (encryptedFromServer) {
      const raw = await decryptAESWithRSA(encryptedFromServer, myPrivateKey);
      const aesKey = await importAESKey(raw);
      roomKeys.set(roomId, aesKey);
      return;
    }

    // 🆕 First time → generate AES
    const aesKey = await generateAESKey();
    const rawAES = await exportAESKey(aesKey);

    const encryptedAES = await encryptAESWithRSA(rawAES, receiverPublicKey);

    roomKeys.set(roomId, aesKey);

    return encryptedAES; // send to backend
  }

  async function encrypt(roomId, message) {
    const key = roomKeys.get(roomId);
    if (!key) throw new Error("AES key missing");
    return encryptMessage(key, message);
  }

  async function decrypt(roomId, cipherText, iv) {
    const key = roomKeys.get(roomId);
    if (!key) throw new Error("AES key missing");
    return decryptMessage(key, cipherText, iv);
  }

  return { setupRoomKey, encrypt, decrypt };
}
