// src/pages/UpcomingEvents.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://genai-backend-2gji.onrender.com/api"; // Django API base

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  //const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_BASE}/events/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Unable to load event, please check login or permissions");
        }

        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleClick = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/events/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Unable to load event details");
      }

      const data = await res.json();
      const startTime = data.start_time;
      const endTime = data.end_time;

      // If it is the initial preset value, it means that the time has not been set yet.
      if (
        startTime?.endsWith("00:00:00Z") &&
        endTime?.endsWith("23:59:59Z")
      ) {
        navigate(`/event/${id}/choose-event-time`);
      } else {
        navigate(`/event/${id}`);
      }
    } catch (err) {
      console.error("error：", err);
      // alert("error");
    }
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
          const displayName = event.name || "（Unknown event）";
          const displayDate = event.start_time?.slice(0, 10) || "Unknown date";

          return (
            <li
              key={event.id}
              onClick={() => handleClick(event.id)}
              className="cursor-pointer bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow border border-white/10 flex justify-between items-center hover:bg-white/20 transition"
            >
              <span className="font-medium text-white">{displayName}</span>
              <span className="text-sm text-white/70">{displayDate}</span>
            </li>
          );
        })}
      </ul>


    </div>
  );
};

export default UpcomingEvents;