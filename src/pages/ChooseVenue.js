import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const ChooseVenue = () => {
  const { id } = useParams();
  const { state } = useLocation(); // Receive data from the previous page
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [venueSuggestions, setVenueSuggestions] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

    useEffect(() => {
    if (state?.venue_suggestions) {
      setVenueSuggestions(state.venue_suggestions);
      
      if (state.venue_suggestions.length > 0) {
        //setSelectedVenueId(state.venue_suggestions[0].id);
        setSelectedIndex(0);  // Select the first one by default
      }
    } else {
      console.warn("⚠️ No venue suggestions received from previous page.");
    }
  }, [state]);

  const handleConfirm = async () => {

    const selectedVenue = venueSuggestions[selectedIndex];
    console.log(selectedIndex);
    console.log(selectedVenue);

    if (!selectedVenue) {
      console.error("❌ No venue selected.");
      return;
    }
  const selectedVenueId = selectedVenue.id;
  console.log("Sending PUT to ID:", selectedVenueId);
  //const selectedVenue = venueSuggestions.find(v => v.id === selectedVenueId);
  try {
      const res = await fetch(`https://genai-backend-2gji.onrender.com/api/venue-suggestions/${selectedVenueId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${token}`
      },
      body: JSON.stringify({
        name: selectedVenue.name,
        address: selectedVenue.address,
        capacity: selectedVenue.capacity,
        transportation_score: selectedVenue.transportation_score,
        map_url: selectedVenue.map_url,
        is_outdoor: selectedVenue.is_outdoor
      })
    });
    if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Insufficient permissions, please log in again");
        }
        throw new Error("Update site failed");
      }

      const data = await res.json();
      console.log("Venue confirmed:", data);
      navigate(`/event/${id}`);
    } catch (err) {
      console.error("❌ Failed to confirm venue:", err);
      alert(err.message);
    }
  };

  return (
    // <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
    
    <div className="relative min-h-screen flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">

      <main className="flex-1 flex flex-col p-8">
        <h1 className="text-3xl font-bold mb-6 drop-shadow-md">
          🎯 Choose Venue
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center mx-auto py-4">
          {venueSuggestions.map((venue, index) => (
            <label
              key={index}
              className={`w-[300px] h-[220px] flex flex-col justify-between p-4 rounded-lg cursor-pointer border transition shadow-md ${
                selectedIndex === index
                  ? "bg-cyan-500 text-white border-cyan-400"
                  : "bg-white text-black border-white/50 hover:bg-cyan-100"
              }`}
            >
              <input
                type="radio"
                name="venue"
                value={index}
                onChange={() => setSelectedIndex(index)}
                checked={selectedIndex === index}
                className="mr-2"
              />
              <div className="flex flex-col space-y-1">
                <div className="font-bold text-lg">{venue.name}</div>
                <div className="text-sm">🏛 Capacity: {venue.capacity}</div>
                <div className="text-sm">🚇 Transportation score: {venue.transportation_score}</div>
                {/* <div className="text-sm"> Is outdoor: {venue.is_outdoor ? "是" : "否"}</div> */}
                <div className="text-sm">🏞 Type: {venue.is_outdoor ? "outdoor" : "indoor"}</div>
                <div className="text-sm truncate">📍 Address: {venue.address || "無"}</div>
                {venue.map_url && (
                  <div className="text-sm underline text-blue-500 mt-1">
                    <a href={venue.map_url} target="_blank" rel="noopener noreferrer">
                      📌 Map link
                    </a>
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>

      {/* Lower left corner return */}
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={() => navigate(`/event/${id}`)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow border border-gray-400"
          >
            ← Back
          </button>
        </div>

      {/* Save in the lower right corner */}
        <div className="flex justify-end pt-6">
          <button
            onClick={handleConfirm}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
          >
            Save
          </button>
        </div>



      </main>
    </div>
  );
};

export default ChooseVenue;