// src/pages/EventVersionPage.js
import React from "react";
import { useParams } from "react-router-dom";

const EventVersionPage = () => {
  const { id, version } = useParams();

  const sidebarItems = ["海報", "文案", "場地", "邀請函", "報名", "分配任務"];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      {/* Sidebar */}
      <div className="w-64 p-6 border-r border-white/10 bg-white/5">
        <h3 className="text-xl font-bold mb-4">📌 功能選單</h3>
        <ul className="space-y-2">
          {sidebarItems.map((item, index) => (
            <li
              key={index}
              className="p-2 rounded-xl hover:bg-white/20 cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Chatbox area */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">🧾 Event {id} - {version.toUpperCase()}</h2>
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl h-[400px] overflow-y-auto shadow-inner">
          <p>這裡是 {version} 的對話紀錄...</p>
          {/* 可改成實際 chatbox 元件 */}
        </div>
      </div>
    </div>
  );
};

export default EventVersionPage;
