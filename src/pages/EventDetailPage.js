// src/pages/EventDetailPage.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const versions = ["v1", "v2", "v3", "v4"];
  const sidebarItems = ["海報", "文案", "場地", "邀請函", "報名", "分配任務"];

  const [selectedVersion, setSelectedVersion] = useState("v1");

  const handleFunctionClick = (item) => {
    if (item === "海報") {
      // 跳轉到 Poster_info 頁面
      navigate(`/event/${id}/${selectedVersion}/poster-info`);
    } else {
      // 可擴充其他功能點擊邏輯
      console.log(`尚未設定 ${item} 的跳轉`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      {/* Left column: Versions */}
      <div className="w-32 p-4 border-r border-white/10 bg-white/5">
        <h3 className="text-md font-semibold mb-4 text-cyan-300">版本</h3>
        <ul className="space-y-2">
          {versions.map((ver) => (
            <li key={ver}>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg transition ${
                  selectedVersion === ver
                    ? "bg-cyan-600 text-white"
                    : "hover:bg-white/10 text-gray-300"
                }`}
                onClick={() => setSelectedVersion(ver)}
              >
                {ver.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Right side */}
      <div className="flex-1 flex">
        {/* Sidebar 功能選單 */}
        <div className="w-64 p-6 border-r border-white/10 bg-white/5">
          <h3 className="text-xl font-bold mb-4">📌 功能選單</h3>
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li
                key={index}
                className="p-2 rounded-xl hover:bg-white/20 cursor-pointer"
                onClick={() => handleFunctionClick(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Chatbox 區域 */}
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">
            🧾 Event {id} - {selectedVersion.toUpperCase()}
          </h2>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl h-[400px] overflow-y-auto shadow-inner">
            <p>這裡是 {selectedVersion} 的對話紀錄...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
