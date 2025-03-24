import { useState, useEffect } from "react";
import { Send, Search } from "lucide-react";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [socket, setSocket] = useState(null);

  //fetch all chats
  useEffect(() => {
    fetch("http://127.0.0.1:8080/getchatsbyuser" , {
      headers:{
        'Authorization': localStorage.getItem("authToken")
      }
    })
      .then((res) => res.json())
      .then((data) => setChats(data))
      .catch((err) => console.error("Error fetching chats:", err));
  }, []);

  // Connect to the WebSocket
  useEffect(() => {
  if (socket) {
    socket.close();
  }

  // const ws = new ReconnectingWebSocket(
  //   `ws://localhost:8080/ws`,
  //   []
  // );

  const ws = new WebSocket( `ws://localhost:8080/ws` , []);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    setMessages((prevMessages) => [...prevMessages, data]);
  }

  setSocket(ws);

  }, []);

  const connectToChat = (chat) => {
      // setSelectedChat(chat);
     ws.send(JSON.stringify({ chatID: chat.ID , type: "subscribe" }));

  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([
        ...messages,
        { text: message, sender: "You", avatar: "https://via.placeholder.com/40" },
      ]);
      setMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 p-4 bg-gray-800 flex flex-col space-y-4">
        <div className="flex items-center space-x-2 p-2 bg-gray-700 rounded-lg">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none text-white w-full"
          />
        </div>
        <div className="space-y-3 overflow-auto flex-1">
          {chats.map((chat) => (
            <div key={chat.ID || index} className="p-3 bg-gray-700 rounded-lg cursor-pointer">
              {chat.ID}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Chat Header */}
        <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center">
          <h2 className="text-lg font-semibold">Office Chat</h2>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender !== "You" && (
                <img src={msg.avatar} alt="User" className="w-10 h-10 rounded-full mr-3" />
              )}
              <div
                className={`p-4 rounded-xl max-w-xs ${
                  msg.sender === "You" ? "bg-blue-500" : "bg-gray-700"
                }`}
              >
                <p>{msg.text}</p>
              </div>
              {msg.sender === "You" && (
                <img src={msg.avatar} alt="User" className="w-10 h-10 rounded-full ml-3" />
              )}
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full p-3 bg-gray-700 text-white rounded-lg outline-none"
            />
            <button type="submit" className="ml-4 p-3 bg-blue-500 rounded-lg hover:bg-blue-600">
              <Send className="text-white" size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;