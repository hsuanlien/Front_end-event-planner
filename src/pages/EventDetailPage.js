// src/pages/EventDetailPage.js 
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const versions = ["v1"];
  const [selectedVersion, setSelectedVersion] = useState("v1");

  // 前端暫存完成狀態
  const [venueCompleted, setVenueCompleted] = useState(true);
  const [formCompleted, setFormCompleted] = useState(true);

  // 功能選單與依賴條件
  const sidebarItems = [
    { label: "Task assignment", key: "Task assignment", requires: [] },
    { label: "場地", key: "場地", requires: [] },
    { label: "報名表單", key: "報名表單", requires: [] },
    { label: "邀請函", key: "邀請函", requires: ["場地", "報名表單"] },
    { label: "文案", key: "文案", requires: ["場地", "報名表單"] },
    { label: "海報", key: "海報", requires: ["場地", "報名表單"] },
  ];

  // 點擊功能選單的處理邏輯
  const handleFunctionClick = (itemKey) => {
    if (itemKey === "場地") {
      setVenueCompleted(true); // 模擬完成
      navigate(`/event/${id}/${selectedVersion}/venue`);
    } else if (itemKey === "報名表單") {
      setFormCompleted(true); // 模擬完成
      navigate(`/event/${id}/${selectedVersion}/check-registration`);
    } else if (itemKey === "邀請函") {
      navigate(`/event/${id}/${selectedVersion}/invitation`);
    } else if (itemKey === "文案") {
      navigate(`/event/${id}/${selectedVersion}/copywriting`);
    } else if (itemKey === "海報") {
      navigate(`/event/${id}/${selectedVersion}/poster-info`);
    } else if (itemKey === "Task assignment") {
      navigate(`/event/${id}/${selectedVersion}/assignment-task`);
    } else {
      console.log(`尚未設定 ${itemKey} 的跳轉`);
    }
  };

  // 檢查功能是否啟用
  const isItemEnabled = (item) =>
    item.requires.every((dep) => {
      if (dep === "場地") return venueCompleted;
      if (dep === "報名表單") return formCompleted;
      return true;
    });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      {/* 左欄版本選單 */}
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

      {/* 主區塊 */}
      <div className="flex-1 flex">
        {/* 左側功能選單 */}
        <div className="w-64 p-6 border-r border-white/10 bg-white/5">
          <h3 className="text-xl font-bold mb-4">📌 功能選單</h3>
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => {
              const enabled = isItemEnabled(item);
              return (
                <li
                  key={index}
                  className={`p-2 rounded-xl transition ${
                    enabled
                      ? "hover:bg-white/20 cursor-pointer text-white"
                      : "text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (enabled) handleFunctionClick(item.key);
                  }}
                >
                  {item.label}
                </li>
              );
            })}
          </ul>
        </div>

        {/* 右側內容區 */}
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">
            🧾 Event {id} - {selectedVersion.toUpperCase()}
          </h2>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl h-[400px] overflow-y-auto shadow-inner">
            <p>這裡是 {selectedVersion} Event data</p>
            <p className="mt-4 text-sm text-gray-300">
              狀態｜場地完成：{venueCompleted ? "✅" : "❌"}，
              報名表單完成：{formCompleted ? "✅" : "❌"}
            </p>
          </div>

          <div className="flex gap-10 mt-6">
            <button
              onClick={() => alert("Change clicked")}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
            >
              Change
            </button>
            <button
              onClick={() => alert("Save clicked")}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
