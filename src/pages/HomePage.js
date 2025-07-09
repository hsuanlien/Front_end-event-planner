import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

const HomePage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate(); // 加入這行
  const token = localStorage.getItem("token");

  const handleLogout = async () => {
  try {
    const response = await fetch("https://genai-backend-2gji.onrender.com/accounts/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        // 這裡 username/password 其實後端不應該再需要，如果後端真的要求，你就必須把它從 localStorage 或 context 傳進來
        // username:  // 根據你實際使用者
        // password: 
      }),
    });

    if (response.ok) {
      alert("登出成功！");
      localStorage.removeItem("token");
      navigate("/");
    } else {
      const data = await response.json();
      alert(`登出失敗：${data.detail || "請重新登入"}`);
    }
      } catch (error) {
        console.error("登出錯誤:", error);
        alert("登出時發生錯誤");
      }
    };

    return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
      {/* Sidebar 側邊欄 */}
      <aside className="w-64 bg-white/10 backdrop-blur-md border-r border-white/20 p-6 flex flex-col justify-between shadow-lg z-10">
        <div>
          <h2 className="text-2xl font-bold mb-6 tracking-wide drop-shadow-md text-left">
            Home
          </h2>
          <nav className="flex flex-col gap-4 text-lg text-left">
            <button
              onClick={() => navigate("/add-event")}
              className="hover:text-cyan-400 transition text-left"
            >
              ➕ Add Event
            </button>

            <button
              onClick={() => navigate("/upcoming-events")}
              className="hover:text-cyan-400 transition text-left"
            >
              📅 Upcoming Events
            </button>
            <button
              onClick={() => navigate("/user-profile")}
              className="hover:text-cyan-400 transition text-left"
            >
              👤 User Profile
            </button>
          </nav>
        </div>

        {/* Log out 按鈕固定在左下 */}
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 text-left"
    
        >
          🚪 Log out
        </button>
      </aside>
    </div>
  );

};

export default HomePage;
