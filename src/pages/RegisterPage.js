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

  const handleRegister = async () => {
  const { username, email, password } = formData;

  // 檢查是否缺少必要欄位
  if (!username || !email || !password) {
    alert("❌ Username, password, and email are required.");
    return;
  }

  try {
    const res = await fetch("/mock/mock-response.json");
    const data = await res.json();

    const existingUser = data.users.find(
      (user) => user.username === username || user.email === email
    );

    if (existingUser) {
      if (existingUser.username === username) {
        alert("⚠️ Username already exists.");
      } else {
        alert("⚠️ Email already exists.");
      }
      return;
    }

    // 模擬成功註冊
    alert("✅ Registration successful! Please check your email to activate your account.");
    navigate("/");

    } catch (error) {
      console.error("Error during registration:", error);
      alert("⚠️ Unexpected error. Please try again.");
      }
    };


  // const handleRegister = () => {
  //   const newUser = {
  //     id: Date.now(),
  //     username: formData.username,
  //     email: formData.email,
  //     password: formData.password
  //   };

  //   // implement here: 驗證輸入欄位是否為空，密碼長度是否足夠等
  //   if (!newUser.username || !newUser.email || !newUser.password) {
  //     alert("請填寫所有欄位");
  //     return;
  //   }
  //   // implement here: 發送資料到後端儲存帳戶資訊（可使用 fetch/axios）
  //   console.log("Send this JSON to backend:", JSON.stringify(newUser));
  //   alert("註冊成功，回登入頁面！");
  //   navigate("/");
  // };

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
//     password: "",
//     first_name: "",
//     last_name: "",
//     address: ""
//   });

//   const [message, setMessage] = useState("");
//   const [activationLink, setActivationLink] = useState("");

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleRegister = async () => {
//     const { username, email, password } = formData;

//     // 檢查必要欄位
//     if (!username || !email || !password) {
//       setMessage("請填寫使用者名稱、電子信箱與密碼。");
//       return;
//     }

//     try {
//       const response = await fetch("http://127.0.0.1:8000/accounts/register/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();

//       if (response.status === 201) {
//         setMessage(data.message);
//         setActivationLink(data.activation_link);
//       } else {
//         setMessage(data.error || "註冊失敗，請稍後再試。");
//       }
//     } catch (error) {
//       console.error("註冊失敗：", error);
//       setMessage("系統錯誤，請稍後再試。");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 relative overflow-hidden">
//       {/* 背景光暈 */}
//       <div className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-10 left-10"></div>
//       <div className="absolute w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-10 right-10"></div>

//       <h1 className="text-4xl font-extrabold text-white mb-10">
//         Event <span className="text-cyan-400">Planner</span>
//       </h1>

//       <div className="backdrop-blur-md bg-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-white/20 z-10">
//         <h2 className="text-2xl font-semibold text-center text-white mb-6">註冊帳號</h2>

//         {["username", "email", "password", "first_name", "last_name", "address"].map((field, i) => (
//           <input
//             key={i}
//             type={field === "password" ? "password" : "text"}
//             name={field}
//             placeholder={field === "username" ? "使用者名稱" :
//                         field === "email" ? "電子信箱" :
//                         field === "password" ? "密碼" :
//                         field === "first_name" ? "名" :
//                         field === "last_name" ? "姓" : "地址"}
//             onChange={handleChange}
//             className="w-full p-3 mb-4 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
//           />
//         ))}

//         <button
//           onClick={handleRegister}
//           className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition font-semibold shadow-lg"
//         >
//           註冊
//         </button>

//         <button
//           onClick={() => navigate("/")}
//           className="w-full mt-4 text-cyan-300 hover:underline text-sm text-center"
//         >
//           已有帳號？前往登入
//         </button>

//         {message && (
//           <div className="mt-6 text-sm text-white text-center">
//             {message}
//             {activationLink && (
//               <div className="mt-2">
//                 <a
//                   href={activationLink}
//                   className="text-cyan-300 underline break-all"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   點此啟用帳號
//                 </a>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RegisterPage; 

