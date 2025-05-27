import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

const HomePage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [comments, setComments] = useState({}); // 儲存每則訊息的註解
  const navigate = useNavigate(); // 加入這行

  // 發送訊息的函式
  const sendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
      {/* Sidebar 側邊欄 */}
      <aside className="w-64 bg-white/10 backdrop-blur-md border-r border-white/20 p-6 flex flex-col shadow-lg z-10">
        <h2 className="text-2xl font-bold mb-6 tracking-wide drop-shadow-md text-left">
          Menu
        </h2>
        <nav className="flex flex-col gap-4 text-lg text-left">
          <button onClick={() => navigate("/add-event")} className="hover:text-cyan-400 transition text-left">➕ Add Event</button>
          <button onClick={() => navigate("/upcoming-events")} className="hover:text-cyan-400 transition text-left">📅 Upcoming Events</button>
          <button onClick={() => navigate("/reminders")} className="hover:text-cyan-400 transition text-left">⏰ Reminders</button>
          <button onClick={() => navigate("/history")} className="hover:text-cyan-400 transition text-left">📖 History</button>
          <button onClick={() => navigate("/user-profile")} className="hover:text-cyan-400 transition text-left">👤 User Profile</button>
        </nav>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col p-8">
        <h1 className="text-3xl font-bold mb-6 drop-shadow-md">
          🗨️ Event Planner Chat
        </h1>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-inner mb-6 space-y-3">
          {messages.length === 0 ? (
            <p className="text-gray-300 italic">No messages yet...</p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg max-w-lg ${
                  msg.sender === "user"
                    ? "bg-cyan-500 text-white self-end ml-auto"
                    : "bg-white text-black"
                }`}
              >


                {/* 主訊息內容 */}
                <strong>{msg.sender}: </strong> {msg.text}
                {/* 註解欄位 */}
                <div className="mt-3">
                  <label className="block text-sm mb-1 text-white/80">💬 Comment:</label>
                  {/* <input
                    type="text"
                    placeholder="Leave a comment..."
                    value={comments[idx] || ""}
                    onChange={(e) => handleCommentChange(idx, e.target.value)}
                    className="w-full p-2 rounded bg-white/10 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  /> */}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-lg bg-white/20 placeholder-gray-300 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
