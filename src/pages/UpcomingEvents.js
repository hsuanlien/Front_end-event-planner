// src/pages/UpcomingEvents.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../config";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(API.EVENTS, {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      } else {
        setError("無法載入活動");
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const handleClick = (id) => {
    navigate(`/event/${id}`);
  };

  if (loading) return <div className="text-gray-300">載入中...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow">
        📅 Upcoming Events
      </h2>
      <ul className="space-y-4 max-w-xl mx-auto">
        {events.map((event) => {
          // 取最新版本
          let latest = event.versions
            ? event.versions[event.versions.length - 1]
            : event;
          return (
            <li
              key={event.id}
              onClick={() => handleClick(event.id)}
              className="cursor-pointer bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow border border-white/10 flex justify-between items-center hover:bg-white/20 transition"
            >
              <span className="font-medium text-white">{latest.name}</span>
              <span className="text-sm text-white/70">
                {latest.date?.slice(0, 10)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default UpcomingEvents;