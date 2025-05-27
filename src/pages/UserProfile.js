// src/pages/UserProfile.js
import React, { useState } from "react";

const UserProfile = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("");

  const handleSave = () => {
    alert("資料已更新！");
    // 儲存 API 邏輯
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow">👤 User Profile</h2>
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg max-w-xl mx-auto space-y-4 border border-white/10">
        <input
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
          type="password"
          placeholder="Change Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSave}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg font-semibold"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
