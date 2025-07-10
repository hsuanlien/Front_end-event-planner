import { fetchWithAuth } from "../utils/auth";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ChooseEventTime = () => {
  const { id, version } = useParams();
  const navigate = useNavigate();

  const [eventDate, setEventDate] = useState("");
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
  });
  
  useEffect(() => {
    const fetchEventDate = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await fetchWithAuth(`https://genai-backend-2gji.onrender.com/api/events/${id}/`, { 
          // GET request to obtain detailed information about the event
          // headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.start_time) {
            const dateOnly = data.start_time.split("T")[0];
            setEventDate(dateOnly);
          }
          localStorage.setItem("event_id", id);//save event id
        } else {
          console.error("Unable to load event data");
        }
      } catch (error) {
        console.error("Error occurred:", error);
      }
    };

    fetchEventDate();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("access_token");
    const { startTime, endTime } = formData;

    if (!startTime || !endTime) {
      alert("Please select the start and end time.");
      return;
    }

    if (startTime >= endTime) {
      alert("The start time must be earlier than the end time!");
      return;
    }

    try {
      const res = await fetchWithAuth(`https://genai-backend-2gji.onrender.com/api/events/${id}/update/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          start_time: `${eventDate}T${startTime}`,
          end_time: `${eventDate}T${endTime}`,
        }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Update Successful:", data);
      navigate(`/event/${id}`, { state: { timeRange: formData } });
    } else {
      const err = await res.text();
      console.error("Fail:", err);
      alert("Fail!");
    }
  } catch (error) {
    console.error("Error occur!", error);
  }
};

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white p-8">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-cyan-300">
          🕒 Event {id} - Choose Time Period
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block mb-2 text-white font-semibold">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-white font-semibold">End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow border border-gray-400"
        >
          ← Back
        </button>

        <div className="flex gap-10">
          <button
            onClick={handleSubmit}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseEventTime;