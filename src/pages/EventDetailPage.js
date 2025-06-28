// src/pages/EventDetailPage.js 
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Listbox } from '@headlessui/react'

const API_BASE = "http://localhost:8000"; // json-server

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState("v1");
  const [options, setOptions] = useState({ type: [], audience: [], atmosphere: [] });

  useEffect(() => {
    fetch(`${API_BASE}/events_test/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        if (data.versions && data.versions.length > 0) {
          setSelectedVersion(data.versions[data.versions.length - 1].version); // 預設最新
        }
      });
  }, [id]);

  useEffect(() => {
    fetch(`${API_BASE}/event_options`)
      .then(res => res.json())
      .then(data => setOptions(data));
  }, []);

  if (!event) return <div>Loading...</div>;

  const versions = event.versions.map((v) => v.version);

  // 取得目前選擇的版本內容
  const currentVersion = event.versions.find((v) => v.version === selectedVersion);

  // 按下 Save 時，新增新版本
  const handleSave = async (newVersionData) => {
    const newVersionNumber = event.versions.length + 1;
    const newVersion = {
      ...newVersionData,
      version: `v${newVersionNumber}`,
    };
    const updatedEvent = {
      ...event,
      versions: [...event.versions, newVersion],
      latest_version: newVersionNumber,
    };
    await fetch(`${API_BASE}/events_test/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEvent),
    });
    setEvent(updatedEvent);
    setSelectedVersion(newVersion.version);
  };

  // 按下 Change 時，編輯目前版本
  const handleChange = async (changedData) => {
    const updatedVersions = event.versions.map((v) =>
      v.version === selectedVersion ? { ...v, ...changedData } : v
    );
    const updatedEvent = { ...event, versions: updatedVersions };
    await fetch(`${API_BASE}/events_test/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEvent),
    });
    setEvent(updatedEvent);
  };

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

            {/* 新增的下拉選單區塊 */}
            <div className="mt-4">
              <select
                value={currentVersion.type}
                onChange={e => handleChange({ type: e.target.value })}
                className="w-full p-2 rounded-lg bg-blue-900 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="" disabled className="text-gray-400">Event Type</option>
                {options.type.map(opt => (
                  <option key={opt.value} value={opt.value} className="text-black">
                    {opt.label}
                  </option>
                ))}
              </select>

              <select
                value={currentVersion.target_audience}
                onChange={e => handleChange({ target_audience: e.target.value })}
                className="w-full p-2 rounded-lg bg-blue-900 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 mt-2"
              >
                <option value="" disabled className="text-gray-400">Audience</option>
                {options.audience.map(opt => (
                  <option key={opt.value} value={opt.value} className="text-black">
                    {opt.label}
                  </option>
                ))}
              </select>

              <select
                value={currentVersion.atmosphere}
                onChange={e => handleChange({ atmosphere: e.target.value })}
                className="w-full p-2 rounded-lg bg-blue-900 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 mt-2"
              >
                <option value="" disabled className="text-gray-400">Event Atmosphere</option>
                {options.atmosphere.map(opt => (
                  <option key={opt.value} value={opt.value} className="text-black">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-10 mt-6">
            <button
              onClick={() => alert("Change clicked")}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
            >
              Change
            </button>
            <button
              onClick={() => handleSave(currentVersion)}
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

// Mock sidebar items
const sidebarItems = [
  { key: "basic", label: "基本資料" },
  { key: "venue", label: "場地" },
  { key: "registration", label: "報名表單" },
  // 你可以依需求增加更多功能
];

// Mock 功能啟用判斷
const isItemEnabled = (item) => true;

// Mock 功能點擊
const handleFunctionClick = (key) => {
  alert(`功能 ${key} 尚未實作`);
};

// Mock 狀態
const venueCompleted = true;
const formCompleted = false;

export default EventDetailPage;
