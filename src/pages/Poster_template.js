// src/pages/Poster_template.js
import React from "react";
import { useParams } from "react-router-dom";

const PosterTemplate = () => {
  const { id, version } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white p-8">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-cyan-300 mb-6">
          🧾 Poster Template for Event {id} - {version.toUpperCase()}
        </h2>
        <p className="text-gray-200">
          這裡會顯示根據使用者輸入所生成的海報內容（或其他元件）
        </p>
      </div>
    </div>
  );
};

export default PosterTemplate;
