import { fetchWithAuth } from "../utils/auth";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); //Prevent default submit behavior (including Enter and mouse)

    if (!username || !password) {
      alert("Please enter your account and password");
      return;
    }

    try {
      const response = await axios.post("https://genai-backend-2gji.onrender.com/accounts/login/", {
        username,
        password,
      });

    if (response.status === 200) {
      const { access, refresh } = response.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      // const token = response.data.token;
      // console.log("Login successful, Token：", token);
      //axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
        //Query account information
        const profileRes = await axios.get("https://genai-backend-2gji.onrender.com/accounts/", {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        console.log("使用者資訊：", profileRes.data);
        navigate('/upcoming-events');
      }
    } catch (error) {
      alert("Login fail：" + 
          (error.response?.data?.non_field_errors?.[0] ||
          error.response?.data?.error));
    }
  };
  
 // UI
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 relative overflow-hidden">
      {/* background */}
      <div className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-10 right-10"></div>

      {/* Name */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-10 tracking-wide drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
      Event <span className="text-cyan-400">Planner</span>
      </h1>
      {/* Form onSubmit */}
      <form
        onSubmit={handleLogin}
        className="backdrop-blur-md bg-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-white/20 z-10"
      >
        <h2 className="text-2xl font-semibold text-center text-white mb-6 tracking-wide">
          Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <button
          type="submit" //  Submit form button
          className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition font-semibold tracking-wide shadow-lg"
        >
          Submit
        </button>

        <button
          type="button" 
          onClick={() => navigate('/register')}
          className="w-full mt-4 text-cyan-300 hover:underline text-sm text-center"
        >
          Not have an account ? Sign up
        </button>

        <button
          type="button"
          onClick={() => navigate('/forget-passwort')}
          className="w-full mt-4 text-cyan-300 hover:underline text-sm text-center"
        >
          Forget Password
        </button>
      </form>
     
    </div>
  );
}

export default LoginPage;