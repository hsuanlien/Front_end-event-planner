import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ChooseSlogan = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    selectedName: eventName = "",
    slogan: slogans = [],
    eventId,
    description,
    expected_attendees,
    suggested_time,
    suggested_event_duration
  } = location.state || {};

  const [selected, setSelected] = useState("");
  console.log(eventName);

  useEffect(() => {
    if (slogans.length > 0) {
      setSelected(slogans[0]);
    }
  }, [slogans]);

  const handleConfirm = () => {
    navigate("/event-description", {
      state: {
        eventId,
        eventName,
        selectedSlogan: selected,
        description,
        expected_attendees,
        suggested_time,
        suggested_event_duration,
      }
    });
  };

  if (!slogans.length) {
    return (
      <div className="text-white text-center p-8">
        <h1 className="text-2xl">Can't find the slogan, please start again by creating the event</h1>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center drop-shadow-md">
          ✨ Choose Slogan
        </h1>
        <div className="space-y-4">
          {slogans.map((slogan, idx) => (
            <label
              key={idx}
              className={`block p-4 rounded-lg cursor-pointer border ${
                selected === slogan
                  ? "bg-cyan-500 text-white border-cyan-400"
                  : "bg-white text-black border-white/50 hover:bg-cyan-100 transition"
              }`}
            >
              <input
                type="radio"
                name="slogan"
                value={slogan}
                checked={selected === slogan}
                onChange={() => setSelected(slogan)}
                className="mr-2"
              />
              {slogan}
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

export default ChooseSlogan;