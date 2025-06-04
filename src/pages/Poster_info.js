// src/pages/Poster_info.js
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PosterInfo = () => {
  const { id, version } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tone: "",
    language: "",
    version_count: "",
    platform: "poster",
    word_limit: "",
    reward: "",
    keywords_to_emphasize: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("送出的資料:", formData);
    navigate(`/event/${id}/${version}/poster-template`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white p-8">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-cyan-300">
          🎨 Event {id} - {version.toUpperCase()} Poster Info
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {[
            ["tone", "語氣 (如 youthful)"],
            ["language", "語言 (如 zh_tw)"],
            ["version_count", "版本數量"],
            ["word_limit", "字數上限"],
            ["reward", "獎勵說明 (如 First prize: EUR$500)"],
            ["keywords_to_emphasize", "強調關鍵字 (以逗號分隔)"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block mb-1 text-sm text-gray-300">{label}</label>
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          ))}
        </div>

        <button
        onClick={handleSubmit}
        className="mt-8 w-full py-3 text-lg font-semibold text-white bg-cyan-600 hover:bg-cyan-700 border border-cyan-400 rounded-lg shadow-md transition duration-200"
        >
        Finish
        </button>

      </div>
    </div>
  );
};

export default PosterInfo;
