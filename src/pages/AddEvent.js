import { fetchWithAuth } from "../utils/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://genai-backend-2gji.onrender.com/ai/generate-event/";

const AddEvent = () => {
  const [goal, setGoal] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState(50); 
  const [audience, setAudience] = useState("");
  const [atmosphere, setAtmosphere] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const token = localStorage.getItem("access_token");
    // if (!token) {
    //   alert("Please log in");
    //   return;
    // }

    const payload = {
      goal: goal.trim(),
      type,
      date,
      budget: budget,
      target_audience: audience,
      atmosphere,
    };

    try {
      const response = await axios.post(API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        console.log("Event created successfully：", response.data);
        navigate("/choose-name", {
          state: {
            eventId: response.data.event_id,
            names: response.data.name,
            description: response.data.description,
            slogan: response.data.slogan,
            expected_attendees: response.data.expected_attendees,
            suggested_time: response.data.suggested_time,
            suggested_event_duration: response.data.suggested_event_duration,
          },
        });
      }
    } catch (error) {
      console.error("❌ Failed to create activity:", error.response || error.message);
      if (error.response?.status === 401) {
        alert("Verification failed: Please log in again");
      } else {
        alert("Failed to create event, please try again later");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white p-6">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/20">
        <h2 className="text-3xl font-bold mb-8 text-cyan-300 drop-shadow">
          Add New Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30"
            type="text"
            placeholder="Event Goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
          />

          <input
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <select
            className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="" disabled>Event Type</option>
            <option value="Workshop_Training">Workshop / Training</option>
            <option value="Social_Networking">Social / Networking</option>
            <option value="Performance_Showcase">Performance / Showcase</option>
            <option value="Speech_Seminar">Speech / Seminar</option>
            <option value="Recreational_Entertainment">Recreational / Entertainment</option>
            <option value="Market_Exhibition">Market / Exhibition</option>
            <option value="Competition_Challenge">Competition / Challenge</option>
          </select>

          <label className="block text-white">
              <span className="inline-flex items-center gap-2 mb-2">
                Budget:
                <span
                  className="inline-block text-white font-mono text-lg"
                  style={{ minWidth: "60px", textAlign: "right" }}  // ← 固定寬度
                >
                  {budget} EUR
                </span>
              </span>
              <input
                type="range"
                min={50}
                max={1000}
                step={50}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full"
              />
            </label>


          <select
            className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            required
          >
            <option value="" disabled>Audience</option>
            <option value="Students_Young">Students / Young Adults</option>
            <option value="Professionals">Professionals</option>
            <option value="Families">Families</option>
            <option value="Local_Community">Local Community</option>
          </select>

          <select
            className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30"
            value={atmosphere}
            onChange={(e) => setAtmosphere(e.target.value)}
            required
          >
            <option value="" disabled>Event Atmosphere</option>
            <option value="Formal_Professional">Formal / Professional</option>
            <option value="Casual_Friendly">Casual / Friendly</option>
            <option value="Energetic_Fun">Energetic / Fun</option>
            <option value="Relaxed_Calm">Relaxed / Calm</option>
            <option value="Creative_Artistic">Creative / Artistic</option>
            <option value="Immersive_Interactive">Immersive / Interactive</option>
          </select>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;