import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// 0618Task3
const CheckInvitation = () => {
  const navigate = useNavigate();
  const { id, version } = useParams();
  const [selected, setSelected] = useState("");
  const [saved, setSaved] = useState(false);
  const names = [
    // "Unity Fest",
    // "Campus Connect",
    // "Together 2025",
    // "Student Pulse",
    // "Youth Link"
  ];

  // 0618Task3
  const handleConfirm = () => {};

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate(`/event/${id}/${version}/check-invitation`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
      <main className="flex-1 flex flex-col p-8">
        <h1 className="text-3xl font-bold mb-6 drop-shadow-md">
          🎯 Choose Venue
        </h1>

        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-inner space-y-4 max-w-xl">
          {names.map((name, idx) => (
            <label
              key={idx}
              className={`block p-4 rounded-lg cursor-pointer border ${
                selected === name
                  ? "bg-cyan-500 text-white border-cyan-400"
                  : "bg-white text-black border-white/50 hover:bg-cyan-100 transition"
              }`}
            >
              <input
                type="radio"
                name="eventName"
                value={name}
                onChange={() => setSelected(name)}
                className="mr-2"
              />
              {name}
            </label>
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
          {/* 返回 event 主頁 */}
          <button
            onClick={() => navigate(`/event/${id}`)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow border border-gray-400"
          >
            ← 返回
          </button>
          <div className="flex gap-10">
            <button
              onClick={() => navigate(`/event/${id}/${version}/choose-venue`)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
            >
              Change
            </button>
            <button
              onClick={handleSave}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
            >
              Save
            </button>
            <button
              onClick={() => alert("Send clicked")}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
            >
              Send
            </button>
          </div>
        </div>
        {saved && (
          <div className="mt-4 text-green-400 font-bold">已儲存！</div>
        )}
      </main>
    </div>
  );
};

export default CheckInvitation;
