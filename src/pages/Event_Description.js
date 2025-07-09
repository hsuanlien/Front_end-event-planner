import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Event_Description = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    eventId,
    eventName,
    selectedSlogan,
    description,
    expected_attendees,
    suggested_time,
    suggested_event_duration,
  } = location.state || {};

  const token = localStorage.getItem("token");

  // 狀態管理
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(eventName || "");
  const [slogan, setSlogan] = useState(selectedSlogan || "");
  const [desc, setDesc] = useState(description || "");
  const [attendees, setAttendees] = useState(expected_attendees || "");
  const [time, setTime] = useState(suggested_time || "");
  const [duration, setDuration] = useState(suggested_event_duration || "");

  const handleSave = async () => {
  console.log(" Token used for request: ", token);
  try {
      // 1. PATCH 更新活動資料
      const patchResponse = await fetch(
        `https://genai-backend-2gji.onrender.com/api/events/${eventId}/update/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            name,
            slogan,
            description: desc,
            expected_attendees: attendees,
            suggested_time: time,
            suggested_event_duration: duration,
          }),
        }
      );

      if (!patchResponse.ok) {
        const errorText = await patchResponse.text();
        console.error("❌ 更新失敗：", errorText);
        alert("Update failed.");
        return;
      }

      const updatedEvent = await patchResponse.json();
      console.log("✅ 活動更新成功：", updatedEvent);
    } catch (err) {
      console.error("❌ 發送請求錯誤：", err);
      alert("An error occurred while saving.");
    }
  };

  const handleNext = async () => {
  console.log(" Token used for request: ", token);
  try {
      // 1. PATCH 更新活動資料
      const patchResponse = await fetch(
        `https://genai-backend-2gji.onrender.com/api/events/${eventId}/update/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            name,
            slogan,
            description: desc,
            expected_attendees: attendees,
            suggested_time: time,
            suggested_event_duration: duration,
          }),
        }
      );

      if (!patchResponse.ok) {
        const errorText = await patchResponse.text();
        console.error("❌ 更新失敗：", errorText);
        alert("Update failed.");
        return;
      }

      const updatedEvent = await patchResponse.json();
      console.log("✅ 活動更新成功：", updatedEvent);
    } catch (err) {
      console.error("❌ 發送請求錯誤：", err);
      alert("An error occurred while saving.");
    }
    navigate("/upcoming-events");
  };


  const handleNext_ = () => {
    navigate("/upcoming-events");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center drop-shadow-md">
          📝 Event Description
        </h1>
        <div className="space-y-4">
          <div>
            <strong className="text-cyan-400">Event name：</strong>
            {isEditing ? (
              <input
                className="w-full mt-1 p-2 rounded bg-white/10 text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              name
            )}
          </div>
          <div>
            <strong className="text-cyan-400">Event slogan：</strong>
            {isEditing ? (
              <input
                className="w-full mt-1 p-2 rounded bg-white/10 text-white"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
              />
            ) : (
              slogan
            )}
          </div>
          <div>
            <strong className="text-cyan-400">Expected Attendees：</strong>
            {isEditing ? (
              <input
                type="number"
                className="w-full mt-1 p-2 rounded bg-white/10 text-white"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
              />
            ) : (
              attendees
            )}
          </div>
          <div>
            <strong className="text-cyan-400">Suggested time：</strong>
            {isEditing ? (
              <input
                className="w-full mt-1 p-2 rounded bg-white/10 text-white"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            ) : (
              time
            )}
            <span className="text-sm text-white/80">
              （Total: {duration}）
            </span>
          </div>
          <div>
            <strong className="text-cyan-400">Description：</strong>
            {isEditing ? (
              <textarea
                className="w-full mt-1 p-2 rounded bg-white/10 text-white"
                rows={4}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            ) : (
              <p className="mt-2 whitespace-pre-line">{desc}</p>
            )}
          </div>
        </div>

        {/* 按鈕區塊 */}
        <div className="flex justify-end space-x-4 pt-6">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold shadow"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleNext}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold shadow"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Event_Description;