// src/pages/UpcomingEvents.js
import { fetchWithAuth } from "../utils/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_BASE = "https://genai-backend-2gji.onrender.com/api"; // Django API base

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [deleteMode, setDeleteMode] = useState(false);
  // const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetchWithAuth(`${API_BASE}/events/`, {
          // headers: {
          //   Authorization:`Bearer ${token}`,
          // },
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
    if (deleteMode) {
      handleDelete(id);
      return;
    }
    try {
      const res = await fetchWithAuth(`${API_BASE}/events/${id}/`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
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
    }
  };
  const handleLogout = async () => {
    const refresh = localStorage.getItem("refresh_token");

    await fetchWithAuth("https://genai-backend-2gji.onrender.com/accounts/logout/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    axios.defaults.headers.common["Authorization"] = "";
    navigate("/");
  };
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this event?");
    if (!confirm) return;
    try {
      const res = await fetchWithAuth(`${API_BASE}/events/${id}/delete/`, {
        method: "DELETE",
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });

      if (res.status === 204) {
        alert("Event deleted successfully");
        setEvents(events.filter(event => event.id !== id));
      } else {
        const result = await res.json();
        alert(result.error || "Failed to delete event");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  if (loading) return <div className="text-gray-300">Loading ...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white/10 backdrop-blur-md border-r border-white/20 p-6 flex flex-col justify-between shadow-lg z-10">
        <div>
          <h2 className="text-2xl font-bold mb-6 tracking-wide drop-shadow-md text-left">
            📌 Menu
          </h2>

          <nav className="flex flex-col gap-4 text-lg text-left">
            <button
              onClick={() => navigate("/add-event")}
              className="hover:text-cyan-400 transition text-left"
            >
              ➕ Add Event
            </button>

            <button
              onClick={() => setDeleteMode(!deleteMode)}
              className={`transition text-left ${
                deleteMode ? "text-red-400" : "hover:text-cyan-400"
              }`}
            >
              🗑️ {deleteMode ? "Cancel Delete Mode" : "Delete Events"}
            </button>

            <button
              onClick={() => navigate("/user-profile")}
              className="hover:text-cyan-400 transition text-left"
            >
              👤 User Profile
            </button>
          </nav>
        </div>

        {/* Log out button */}
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 text-left"
        >
          🚪 Log out
        </button>
      </aside>

      {/* Main Content*/}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow">
            Upcoming Events
          </h2>

          <ul className="space-y-4 w-full max-w-lg">
            {events.map((event) => {
              const displayName = event.name || "（Unknown event）";
              const displayDate = event.start_time?.slice(0, 10) || "Unknown date";

              return (
                <li
                  key={event.id}
                  className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow border border-white/10 flex justify-between items-center hover:bg-white/20 transition"
                >
                  <div
                    onClick={() => {
                      if (!deleteMode) handleClick(event.id);
                    }}
                    className={`${!deleteMode ? "cursor-pointer" : ""} flex flex-col`}
                  >
                    <span className="font-medium text-white">{displayName}</span>
                    <span className="text-sm text-white/70">{displayDate}</span>
                  </div>

                  {deleteMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(event.id);
                      }}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
                    >
                      Delete
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default UpcomingEvents;