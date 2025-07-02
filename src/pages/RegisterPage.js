import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    address: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleRegister = async () => {
    const { username, email, password, first_name, last_name, address } = formData;

    if (!username || !email || !password) {
      alert("❌ Username, password, and email are required.");
      return;
    }

    const newUser = {
      username,
      email,
      password,
      first_name,
      last_name,
      address,
    };

    try {
       const res = await fetch("https://genai-backend-2gji.onrender.com/accounts/register/", {
        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (res.status === 201) {
        alert("✅ Registration successful! Please check your email to activate your account.");
        navigate("/");
      } else {
        // 取得後端錯誤訊息
        const errorData = await res.json();
        alert("⚠️ Registration failed: " + (errorData.error || "Please try again."));
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("⚠️ Unexpected error. Please try again.");
    }
  };

  // UI介面設計
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 relative overflow-hidden">
      {/* 背景光暈 */}
      <div className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-10 right-10"></div>

      {/* 標題 */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-10 tracking-wide drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
        Event <span className="text-cyan-400">Planner</span>
      </h1>

      {/* 註冊卡片 */}
      <div className="backdrop-blur-md bg-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-white/20 z-10">
        <h2 className="text-2xl font-semibold text-center text-white mb-6 tracking-wide">
          Register account
        </h2>

        {/* 表單欄位 */}
        <input
          type="text"
          name="username"
          placeholder="User name"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <input
          type="text"
          name="first_name"
          placeholder="First name"
          value={formData.first_name}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last name"
          value={formData.last_name}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-3 mb-6 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        {/* 註冊按鈕 */}
        <button
          onClick={handleRegister}
          className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition font-semibold tracking-wide shadow-lg"
        >
          Submit
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 text-cyan-300 hover:underline text-sm text-center"
        >
          Already have an account? Go to Login
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;