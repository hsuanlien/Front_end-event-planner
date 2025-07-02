// src/pages/EventDetailPage.js 
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const versions = ["v1"];// 待修改
  const [selectedVersion, setSelectedVersion] = useState("v1");

  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem("token");
  // temporary storage completion status
  const [venueCompleted, setVenueCompleted] = useState(true);
  const [formCompleted, setFormCompleted] = useState(true);
  const version_id =3 ;

  // Function menu and dependencies
  const sidebarItems = [
    { label: "Task assignment", key: "Task assignment", requires: [] },
    { label: "Venue Selection", key: "場地", requires: [] },
    { label: "Registration Form", key: "報名表單", requires: [] },
    { label: "Invitation letter", key: "邀請函", requires: ["場地", "報名表單"] },
    { label: "Social media post", key: "文案", requires: ["場地", "報名表單"] },
    // { label: "海報", key: "海報", requires: ["場地", "報名表單"] },
  ];

  // Click the processing logic of the function menu
  const handleFunctionClick = (itemKey) => {
    if (itemKey === "場地") {
      setVenueCompleted(true); 
      navigate(`/event/${id}/${selectedVersion}/venue`);
    } else if (itemKey === "報名表單") {
      setFormCompleted(true); 
      navigate(`/event/${id}/${selectedVersion}/check-registration`);
    } else if (itemKey === "邀請函") {
      navigate(`/event/${id}/${selectedVersion}/invitation`);
    } else if (itemKey === "文案") {
      navigate(`/event/${id}/${selectedVersion}/copywriting`);
    }
    // } else if (itemKey === "海報") {
    //   navigate(`/event/${id}/${selectedVersion}/poster-info`);
    // } 
    else if (itemKey === "Task assignment") {
      navigate(`/event/${id}/${selectedVersion}/assignment-task`);
    } else {
      console.log(`尚未設定 ${itemKey} 的跳轉`);
    }
  };

    useEffect(() => {
    const fetchEventVersion = async () => {
      try {
        const response = await fetch(
          `https://genai-backend-2gji.onrender.com/api/events/${id}/versions/${version_id}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setEventData(data.event_snapshot); // Only snapshot data
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch event version:", err);
      }
    };

    fetchEventVersion();
  }, [id, versions]);

  // Check if the feature is enabled
  const isItemEnabled = (item) =>
    item.requires.every((dep) => {
      if (dep === "場地") return venueCompleted;
      if (dep === "報名表單") return formCompleted;
      return true;
    });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      {/* Version menu on the left column */}
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

      {/* Main UI */}
      <div className="flex-1 flex">
        {/* Meun function  on the left */}
        <div className="w-64 p-6 border-r border-white/10 bg-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-4">📌 Menu</h3>
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

          {/* Back Button */}
          <div className="mt-6">
            <button
              onClick={() => navigate("/home")}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 text-sm rounded-lg shadow border border-gray-400"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Right content area */}
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">
            🧾 Event {id} - {selectedVersion.toUpperCase()}
          </h2>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl h-[400px] overflow-y-auto shadow-inner">
            {/* selectedVersion Event data */}
              {error ? (
                    <p className="text-red-400">Fail to load：{error}</p>
                  ) : eventData ? (
                    <div className="space-y-2 text-sm leading-relaxed">
                      <p><strong>🎉 Event name：</strong> {eventData.name}</p>
                      <p><strong>📣 Slogan：</strong> {eventData.slogan}</p>
                      <p><strong>📋 Description：</strong> {eventData.description}</p>
                      <p><strong>📆 Date：</strong> {eventData.start_time} ~ {eventData.end_time}</p>
                      <p><strong>🎯 Target Audience：</strong> {eventData.target_audience}</p>
                      <p><strong>👥 Expected Attendees：</strong> {eventData.expected_attendees}</p>
                      <p><strong>💰 Budge：</strong> {eventData.budget}</p>
                      <p><strong>🛠 State：</strong> {eventData.status}</p>
                    </div>
                  ) : (
                    <p>Loading ...</p>
                  )}
          </div>

          <div className="flex gap-10 mt-6">
            <button
              onClick={() => alert("Change clicked")}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
            >
              Change
            </button>
            <button
              onClick={() => alert("Save clicked")}
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

export default EventDetailPage;