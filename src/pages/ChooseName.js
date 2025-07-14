import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ChooseName = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { names = [], eventId, slogan, description, expected_attendees, suggested_time, suggested_event_duration } = location.state || {};

  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (names.length > 0) {
      setSelected(names[0]);
    }
  }, [names]);

  const handleConfirm = () => {
    // Continue to next page with the selected event name and other event information
    navigate("/choose-slogan", {
      state: {
        eventId,
        selectedName: selected,
        slogan,
        description,
        expected_attendees,
        suggested_time,
        suggested_event_duration,
      },
    });
  };

  if (!names.length) {
    return (
      <div className="text-white text-center p-8">
        <h1 className="text-2xl">The event name cannot be found. Please start over by creating the event.</h1>
      </div>
    );
  }
return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center drop-shadow-md">
          🎯 Choose Event Name
        </h1>
        <div className="space-y-4">
          {names.map((name, idx) => (
            <label
              key={idx}
              className={`block p-4 rounded-lg cursor-pointer border ${
                selected === name
                  ? "bg-cyan-500 text-white border-cyan-400"
                  : "bg-white text-black border-white/50 hover:bg-cyan-100 transition"
              }`}
            >
              <input
                type="radio"
                name="eventName"
                value={name}
                checked={selected === name}
                onChange={() => setSelected(name)}
                className="mr-2"
              />
              {name}
            </label>
          ))}
        </div>
        
        <div className="flex justify-end pt-6">
          <button
            onClick={handleConfirm}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
 
};

export default ChooseName;