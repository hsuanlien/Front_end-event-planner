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
      // 若目前在刪除模式，則執行刪除
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
      // alert("error");
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
  // const handleLogout = async () => {
  //   const refresh = localStorage.getItem("refresh_token");
  // //try {
  //   const response = await fetch("https://genai-backend-2gji.onrender.com/accounts/logout/", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Token ${token}`,
  //     },
  //     //body: JSON.stringify({
  //       // 這裡 username/password 其實後端不應該再需要，如果後端真的要求，你就必須把它從 localStorage 或 context 傳進來
  //       // username:  // 根據你實際使用者
  //       // password: 
  //     //}),
  //   });

  //   if (response.ok) {
  //     alert("Successfully log out！");
  //     localStorage.removeItem("token");
  //     navigate("/");
  //   } else {
  //     const data = await response.json();
  //     alert(`Logout fail：${data.detail || "請重新登入"}`);
  //   }
  //     } catch (error) {
  //       console.error("登出錯誤:", error);
  //       //alert("登出時發生錯誤");
  //     }
  //   };

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
    {/* <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white"> */}
      {/* Sidebar 側邊欄 */}
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

        {/* Log out 按鈕固定在左下 */}
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 text-left"
        >
          🚪 Log out
        </button>
      </aside>
      {/* <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow">
        📅 Upcoming Events
      </h2>
      
       排在左側，需要換行 
      <div className="flex flex-col space-y-2 mb-6 max-w-xs">
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
      </div>
 */}

      {/* <ul className="space-y-4 max-w-xl mx-auto">
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
      </ul> */}

      {/* Main Content 區域 */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow">
            Upcoming Events
          </h2>

          {/* <ul className="space-y-4 w-full max-w-2xl"> */}
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