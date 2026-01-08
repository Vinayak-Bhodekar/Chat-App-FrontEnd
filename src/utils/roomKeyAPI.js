import axios from "axios";

export const getRoomKey = async (roomId) => {
  const res = await axios.get(
    `http://localhost:9000/api/room-key/${roomId}`,
    { withCredentials: true }
  );
  return res.data;
};

export const saveRoomKey = async (roomId, encryptedAESKey) => {
  await axios.post(
    "http://localhost:9000/api/saveRoomKey",
    { roomId, encryptedAESKey },
    { withCredentials: true }
  );
};
