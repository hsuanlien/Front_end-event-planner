// src/pages/EventDetailPage.js
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const versions = ["v1", "v2", "v3", "v4"];

  const handleVersionClick = (version) => {
    navigate(`/event/${id}/${version}`);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow">🗂️ Event {id} - Versions</h2>
      <div className="flex gap-4 flex-wrap">
        {versions.map((ver) => (
          <button
            key={ver}
            className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-xl border border-white/20 text-white hover:bg-white/20 transition"
            onClick={() => handleVersionClick(ver)}
          >
            {ver.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventDetailPage;
