import axios from "axios";

export const getRoomKey = async (roomId) => {
  const res = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/room-key/${roomId}`,
    { withCredentials: true }
  );
  return res.data;
};

export const saveRoomKey = async (roomId, encryptedAESKey) => {
  await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/saveRoomKey`,
    { roomId, encryptedAESKey },
    { withCredentials: true }
  );
};
