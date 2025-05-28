// src/pages/UpcomingEvents.js
import React from "react";
import { useNavigate } from "react-router-dom";

const mockEvents = [
  { id: 1, title: "Team Meeting", date: "2025-06-01" },
  { id: 2, title: "Project Demo", date: "2025-06-05" },
];

const UpcomingEvents = () => {
  const navigate = useNavigate();

  const handleClick = (id) => {
  navigate(`/event/${id}`);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow">
        📅 Upcoming Events
      </h2>
      <ul className="space-y-4 max-w-xl mx-auto">
        {mockEvents.map((event) => (
          // 然後在 map 中每個 event 加上 onClick
          <li
            key={event.id}
            onClick={() => handleClick(event.id)}
            className="cursor-pointer bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow border border-white/10 flex justify-between items-center hover:bg-white/20 transition"
          >
            <span className="font-medium text-white">{event.title}</span>
            <span className="text-sm text-white/70">{event.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default UpcomingEvents;