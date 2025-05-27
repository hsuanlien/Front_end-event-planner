// src/pages/Reminders.js
import React, { useState } from "react";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");

  const addReminder = () => {
    if (newReminder.trim() !== "") {
      setReminders([...reminders, newReminder]);
      setNewReminder("");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow">⏰ Set Reminders</h2>
      <div className="max-w-xl mx-auto">
        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
            type="text"
            placeholder="Enter reminder..."
            value={newReminder}
            onChange={(e) => setNewReminder(e.target.value)}
          />
          <button
            onClick={addReminder}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
          >
            Add
          </button>
        </div>
        <ul className="space-y-3">
          {reminders.map((reminder, idx) => (
            <li
              key={idx}
              className="bg-white/10 backdrop-blur-md p-3 rounded-2xl shadow border border-white/10"
            >
              🔔 {reminder}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Reminders;
