import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ 阻止預設提交行為 (包含 Enter 與滑鼠)

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
        const token = response.data.token;
        console.log("Login successful, Token：", token);

        // 儲存 token 到 localStorage
        localStorage.setItem("token", token);
        // console.log("登入 token：", token);

        // 查詢帳號資訊
        const profileRes = await axios.get("https://genai-backend-2gji.onrender.com/accounts/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        console.log("使用者資訊：", profileRes.data);

        // 導向首頁
        navigate('/upcoming-events');
      }
    } catch (error) {
      alert("⚠️ Login fail：" + 
          (error.response?.data?.non_field_errors?.[0] ||
          error.response?.data?.error ||
          "請確認帳密"));

      if (error.response && error.response.status === 400) {
        alert("⚠️ 登入失敗：" + (error.response.data.non_field_errors || "請確認帳密"));
      } else {
        alert("⚠️ 登入過程發生錯誤");
      }
    }
  };
  
 // UI介面設計 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 relative overflow-hidden">
      {/* 背景光暈效果 */}
      <div className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-10 right-10"></div>

      {/* 標誌/標題 */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-10 tracking-wide drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
      Event <span className="text-cyan-400">Planner</span>
      </h1>
{/* ✅ 表單加上 onSubmit */}
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
          type="submit" // ✅ 表單送出按鈕
          className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition font-semibold tracking-wide shadow-lg"
        >
          Submit
        </button>

        <button
          type="button" // ✅ 避免這個 button 被當作 submit
          onClick={() => navigate('/register')}
          className="w-full mt-4 text-cyan-300 hover:underline text-sm text-center"
        >
          Not have an account ? Sign up
        </button>

        <button
          type="button" // ✅ 避免這個 button 被當作 submit
          onClick={() => navigate('/forget-passwort')}
          className="w-full mt-4 text-cyan-300 hover:underline text-sm text-center"
        >
          Forget Passwort
        </button>
      </form>
     
    </div>
  );
}

export default LoginPage;