import { openDB } from "idb";

const DB_NAME = "e2ee-store";
const STORE_NAME = "keys";

export async function getDB() {
  return openDB(DB_NAME, 2, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveRoomKey(key) {
  const db = await getDB();
  await db.put(STORE_NAME, key,"rsa-private");
}

export async function getPrivateKey() {
  const db = await getDB();
  return await db.get(STORE_NAME,"rsa-private")
}
