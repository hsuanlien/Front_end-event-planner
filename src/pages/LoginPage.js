import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {

    if (username && password) {
      // implement here: 呼叫後端 API 檢查帳號密碼是否正確，若正確則導向首頁
      // 需使用 fetch/axios 發送 POST 請求，並根據回傳資料決定導向或顯示錯誤訊息

      navigate('/home'); // 實作完成後，這行可以放在 API 成功回應後執行
    } else {
      // implement here: 錯誤處理 - 顯示欄位不得為空的提示訊息
      alert("請輸入帳號和密碼");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 relative overflow-hidden">
      {/* 背景光暈效果 */}
      <div className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-10 right-10"></div>

      {/* 標誌/標題 */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-10 tracking-wide drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
      Event <span className="text-cyan-400">Planner</span>
      </h1>

      {/* 登入表單卡片 */}
      <div className="backdrop-blur-md bg-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-white/20 z-10">
        <h2 className="text-2xl font-semibold text-center text-white mb-6 tracking-wide">
          登入帳號
        </h2>

        <input
          type="text"
          placeholder="使用者名稱"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <input
          type="password"
          placeholder="密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition font-semibold tracking-wide shadow-lg"
        >
          登入
        </button>

        <button
          onClick={() => navigate('/register')}
          className="w-full mt-4 text-cyan-300 hover:underline text-sm text-center"
        >
          沒有帳號？前往註冊
        </button>
      </div>
    </div>
  );
}

export default LoginPage;



// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function LoginPage() {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);

//   const handleLogin = async () => {
//     if (!username || !password) {
//       alert("請輸入帳號和密碼");
//       return;
//     }

//     try {
//       const response = await fetch("http://127.0.0.1:8000/accounts/login/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ username, password })
//       });

//       const data = await response.json();

//       if (response.status === 200) {
//         console.log("登入成功，token:", data.token);
//         alert("登入成功！");
//         localStorage.setItem("token", data.token);  // 儲存 token 以供後續使用
//         navigate("/home");  // 導向首頁
//       } else if (response.status === 400) {
//         console.warn("登入失敗:", data.error);
//         setError(data.error || "登入失敗，請檢查帳號密碼。");
//       } else {
//         setError("未知錯誤發生。");
//       }
//     } catch (err) {
//       console.error("請求失敗:", err);
//       setError("無法連接伺服器，請稍後再試。");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 relative overflow-hidden">
//       {/* 背景光暈效果 */}
//       <div className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-10 left-10"></div>
//       <div className="absolute w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-10 right-10"></div>

//       {/* 標誌/標題 */}
//       <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-10 tracking-wide drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
//         Event <span className="text-cyan-400">Planner</span>
//       </h1>

//       {/* 登入表單卡片 */}
//       <div className="backdrop-blur-md bg-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-white/20 z-10">
//         <h2 className="text-2xl font-semibold text-center text-white mb-6 tracking-wide">
//           登入帳號
//         </h2>

//         <input
//           type="text"
//           placeholder="使用者名稱"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="w-full p-3 mb-4 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
//         />

//         <input
//           type="password"
//           placeholder="密碼"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-3 mb-4 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
//         />

//         {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

//         <button
//           onClick={handleLogin}
//           className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition font-semibold tracking-wide shadow-lg"
//         >
//           登入
//         </button>

//         <button
//           onClick={() => navigate('/register')}
//           className="w-full mt-4 text-cyan-300 hover:underline text-sm text-center"
//         >
//           沒有帳號？前往註冊
//         </button>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;
