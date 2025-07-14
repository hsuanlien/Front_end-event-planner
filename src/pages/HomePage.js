import { fetchWithAuth } from "../utils/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

const HomePage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate(); 
  //const token = localStorage.getItem("access_token");

  const handleLogout = async () => {
  try {
    const refresh = localStorage.getItem("refresh_token");
    const response = await fetchWithAuth("https://genai-backend-2gji.onrender.com/accounts/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ refresh }),
    });

    if (response.ok) {
      alert("Logout success！");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/");
    } else {
      const data = await response.json();
      alert(`Logout fail：${data.detail || "Please log in again"}`);
    }
      } catch (error) {
        console.error("Logout fail:", error);
        alert("Error logging out");
      }
    };

    return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
      {/* Sidebar */}
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

        {/* Log out button */}
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
