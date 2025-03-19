import { useState } from "react";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([
        ...messages,
        { text: message, sender: "You", avatar: "https://via.placeholder.com/40" },
      ]);
      setMessage(""); // Clear input after sending
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat Messages */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender !== "You" && (
                <img
                  src={msg.avatar}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full mr-4"
                />
              )}
              <div
                className={`p-4 rounded-xl max-w-xs ${
                  msg.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                <p>{msg.text}</p>
              </div>
              {msg.sender === "You" && (
                <img
                  src={msg.avatar}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full ml-4"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-300">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="ml-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;
