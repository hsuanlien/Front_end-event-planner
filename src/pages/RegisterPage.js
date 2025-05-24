import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = () => {
    const newUser = {
      id: Date.now(),
      username: formData.username,
      email: formData.email,
      password: formData.password
    };

    console.log("Send this JSON to backend:", JSON.stringify(newUser));
    alert("註冊成功，回登入頁面！");
    navigate("/");
  };

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
          註冊帳號
        </h2>

        <input
          type="text"
          name="username"
          placeholder="使用者名稱"
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <input
          type="email"
          name="email"
          placeholder="電子信箱"
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <input
          type="password"
          name="password"
          placeholder="密碼"
          onChange={handleChange}
          className="w-full p-3 mb-6 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition font-semibold tracking-wide shadow-lg"
        >
          註冊
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 text-cyan-300 hover:underline text-sm text-center"
        >
          已有帳號？前往登入
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;



// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const RegisterPage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: ""
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleRegister = () => {
//     const newUser = {
//       id: Date.now(), // 以 timestamp 當作模擬 ID
//       username: formData.username,
//       email: formData.email,
//       password: formData.password // 注意：正式環境應加密！
//     };

//     // 模擬傳送 JSON 給後端
//     console.log("Send this JSON to backend:", JSON.stringify(newUser));

//     // 未來這裡可改成 fetch:
//     // fetch("/api/register", {
//     //   method: "POST",
//     //   headers: { "Content-Type": "application/json" },
//     //   body: JSON.stringify(newUser)
//     // });

//     alert("註冊成功，回登入頁面！");
//     navigate("/");
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <input
//         type="text"
//         name="username"
//         placeholder="Username"
//         onChange={handleChange}
//       />
//       <input
//         type="email"
//         name="email"
//         placeholder="Email"
//         onChange={handleChange}
//       />
//       <input
//         type="password"
//         name="password"
//         placeholder="Password"
//         onChange={handleChange}
//       />
//       <button onClick={handleRegister}>註冊</button>
//     </div>
//   );
// };

// export default RegisterPage;
