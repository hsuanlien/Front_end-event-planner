// src/pages/History.js
import React from "react";

const History = () => {
  const historyData = [
    {
      title: "Team Meeting",
      date: "2025-05-10",
      location: "Zoom",
      description: "Weekly project sync with the development team.",
    },
    {
      title: "Birthday Party",
      date: "2025-05-05",
      location: "Home",
      description: "Celebrated with friends and family.",
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow">
        📖 Event History
      </h2>

      {historyData.length === 0 ? (
        <p className="text-gray-300 italic">No past events to show.</p>
      ) : (
        <ul className="space-y-4">
          {historyData.map((event, idx) => (
            <li
              key={idx}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-md"
            >
              <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
              <div className="text-sm text-gray-300 space-y-1">
                <p>📅 {event.date}</p>
                <p>📍 {event.location}</p>
              </div>
              <p className="text-white mt-2">{event.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
