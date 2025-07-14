import { fetchWithAuth } from "../utils/auth";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Venue = () => {
  const { id, version } = useParams();
  const navigate = useNavigate();
  const [venueName, setVenueName] = useState("");
  const [radiusKm, setRadiusKm] = useState("");
  const [venueMessage, setVenueMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVenueSave = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    if (!venueName || !radiusKm) {
      setVenueMessage("請填寫所有欄位");
      setIsSubmitting(false); //  Prevent button sticking
      return;
    }
    try {
      const res = await fetchWithAuth(`https://genai-backend-2gji.onrender.com/ai/generate-venues/${id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: venueName,
          radius_km: Number(radiusKm),
        }),
    });

    if (!res.ok) {
      if (res.status === 403) {
        throw new Error("權限不足，請重新登入");
      }
      throw new Error("提交失敗");
    }
    const data = await res.json();
    console.log("✅ 後端回傳場地建議：", data.venue_suggestions);
    if (!data.venue_suggestions || !Array.isArray(data.venue_suggestions)) {
      throw new Error("後端資料格式錯誤");
    }
    //Show success message first
    setVenueMessage("✅ Submission successful!");
    // Jump with data
      navigate(`/event/${id}/choose-venue`, {
        state: {
          venue_suggestions: data.venue_suggestions,
          eventId: id, // Passed from useParams
        },
      });
    } catch (err) {
      console.error(err);
      setVenueMessage("❌ Submission failed, please check the server.");
    }

    setIsSubmitting(false); //Call finally or at the end of each path
};

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white p-8">
  

      {/* Added venue input area */}
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl mt-10">
        <h3 className="text-2xl font-bold mb-4 text-yellow-300">🏗️ Create Venue</h3>

        <label className="block mb-2 text-white font-medium">📍 Location Name</label>
        <input
          type="text"
          value={venueName}
          onChange={(e) => setVenueName(e.target.value)}
          placeholder="Enter location"
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none"
        />

        <label className="block mb-2 text-white font-medium">📏 Radius (km)</label>
        <input
          type="text"
          value={radiusKm}
          onChange={(e) => setRadiusKm(e.target.value)}
          placeholder="Enter radius"
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none"
        />

        {venueMessage && (
          <p className="text-center text-yellow-300 mt-4">{venueMessage}</p>
        )}
      </div>
      {/*flex */}
      <div className="mt-8 flex justify-between items-center">
        {/* back button */}
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow border border-gray-400"
        >
          ← Back
        </button>

        {/* Add / Change / Save */}
        <div className="flex gap-10">
        {/* The save button should be disabled after clicking to avoid multiple submissions */}
         <button
            onClick={handleVenueSave}
            disabled={isSubmitting}
            className={`bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Venue