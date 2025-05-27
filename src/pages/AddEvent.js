// src/pages/AddEvent.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEvent = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`新增活動：${title}`);
    // TODO: 在這裡加上儲存活動的邏輯
    navigate("/upcoming"); // 提交後導向 upcoming 頁面
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white p-6">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow">
          ➕ Add New Event
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <textarea
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
