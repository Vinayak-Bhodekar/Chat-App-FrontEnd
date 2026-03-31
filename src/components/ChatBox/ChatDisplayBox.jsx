import { useContext } from "react";
import themeContext from "../../contexts/themeContext/themeContext";

function ChatDisplayBox({
  messages,
  profileId,
  friendId,
  selectMessages,
  setSelectMessages
}) {
  const { darkMode } = useContext(themeContext);

  const toggleSelect = (msg) => {
    setSelectMessages((prev = []) =>
      prev.includes(msg)
        ? prev.filter((msgId) => msgId !== msg)
        : [...prev, msg]
    );
  };

  return (
    <div className="p-4 space-y-2">
      {messages.map((msg) => {
        const isMine = msg.sender === profileId;
        const isSeen = msg.readBy?.includes(friendId);
        const isSelected = selectMessages?.includes(msg._id);

        return (
          <div
            key={msg._id}
            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
          >
            <div
              onClick={() => toggleSelect(msg._id)}
              className={`px-3 py-2 rounded-lg max-w-xs break-words cursor-pointer transition
                ${isMine ? "bg-blue-500 text-white" : "bg-white text-black"}
                ${isSelected ? "ring-2 ring-red-500" : ""}
              `}
            >
              <div>{msg.content}</div>

              {isMine && (
                <div className="text-xs text-gray-200 text-right mt-1">
                  {isSeen ? "✓✓" : "✓"}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatDisplayBox;