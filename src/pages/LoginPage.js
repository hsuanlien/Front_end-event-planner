import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username && password) {
      navigate('/home');
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

//   const handleLogin = () => {
//     if (username && password) {
//       navigate('/home');
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
//       <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
//       <button onClick={handleLogin}>Login</button>
//       <button onClick={() => navigate('/register')}>Go to Register</button>
//     </div>
//   );
// }

// export default LoginPage;
