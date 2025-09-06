function ChatDisplayBox({ messages }) {
  const profile = JSON.parse(localStorage.getItem("getProfile"));

  return (
    <div className="p-4 space-y-2">
      {messages.map((msg) =>
        msg.sender === profile?._id ? (
          <div key={msg._id} className="flex justify-end">
            <div className="bg-blue-500 text-white px-3 py-2 rounded-lg max-w-xs break-words">
              {msg.content}
            </div>
          </div>
        ) : (
          <div key={msg._id} className="flex justify-start">
            <div className="bg-white px-3 py-2 rounded-lg max-w-xs shadow break-words">
              {msg.content}
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default ChatDisplayBox;
