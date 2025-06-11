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
      const res = await fetch("http://localhost:8000/accounts/register/", {
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
  // 使用db.json假資料測試的程式碼範例：
  // const handleRegister = async () => {
  //   const { username, email, password, first_name, last_name, address } = formData;

  //   if (!username || !email || !password) {
  //     alert("Username, password, and email are required.");
  //     return;
  //   }

  //   try {
  //     const res = await fetch("http://localhost:3001/users");
  //     const users = await res.json();

  //     const usernameExists = users.some((user) => user.username === username);
  //     const emailExists = users.some((user) => user.email === email);

  //     if (usernameExists) {
  //       alert("Username already exists.");
  //       return;
  //     }

  //     if (emailExists) {
  //       alert("Email already exists.");
  //       return;
  //     }

  //     const newUser = {
  //       username,
  //       email,
  //       password,
  //       first_name,
  //       last_name,
  //       address
  //     };

  //     const postRes = await fetch("http://localhost:3001/users", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(newUser)
  //     });

  //     if (postRes.status === 201) {
  //       alert("✅ Registration successful! Please check your email to activate your account.");
  //       navigate("/");
  //     } else {
  //       alert("⚠️ Registration failed. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error during registration:", error);
  //     alert("⚠️ Unexpected error. Please try again.");
  //   }
  // };

  // UI介面設計 不需要更動
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

        {/* 表單欄位 */}
        <input
          type="text"
          name="username"
          placeholder="使用者名稱"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <input
          type="email"
          name="email"
          placeholder="電子信箱"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <input
          type="password"
          name="password"
          placeholder="密碼"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <input
          type="text"
          name="first_name"
          placeholder="名字"
          value={formData.first_name}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <input
          type="text"
          name="last_name"
          placeholder="姓氏"
          value={formData.last_name}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <input
          type="text"
          name="address"
          placeholder="地址"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-3 mb-6 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        {/* 註冊按鈕 */}
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
//   const handleRegister = async () => {
//   const { username, email, password } = formData;

//   if (!username || !email || !password) {
//     alert("❌ Username, password, and email are required.");
//     return;
//   }

//   try {
//     const res = await fetch("http://localhost:3001/users");
//     const users = await res.json();

//     const usernameExists = users.some((user) => user.username === username);
//     const emailExists = users.some((user) => user.email === email);

//     if (usernameExists) {
//       alert("⚠️ Username already exists.");
//       return;
//     }

//     if (emailExists) {
//       alert("⚠️ Email already exists.");
//       return;
//     }

//     // 新增用戶
//     const newUser = {
//       username,
//       email,
//       password,
//       first_name: "hi",
//       last_name: "hihi",
//       address: "Heilbronn"
//     };

//     const postRes = await fetch("http://localhost:3001/users", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(newUser)
//     });

//     if (postRes.status === 201) {
//       alert("✅ Registration successful! Please check your email to activate your account.");
//       navigate("/");
//     } else {
//       alert("⚠️ Registration failed. Please try again.");
//     }
//   } catch (error) {
//     console.error("Error during registration:", error);
//     alert("⚠️ Unexpected error. Please try again.");
//   }
// };

//   // const handleChange = (e) => {
//   //   setFormData({
//   //     ...formData,
//   //     [e.target.name]: e.target.value
//   //   });
//   // };

//   // const handleRegister = async () => {
//   // const { username, email, password } = formData;

//   // // 檢查是否缺少必要欄位
//   // if (!username || !email || !password) {
//   //   alert("❌ Username, password, and email are required.");
//   //   return;
//   // }

//   // try {
//   //   const res = await fetch("/mock/mock-response.json");
//   //   const data = await res.json();

//   //   const existingUser = data.users.find(
//   //     (user) => user.username === username || user.email === email
//   //   );

//   //   if (existingUser) {
//   //     if (existingUser.username === username) {
//   //       alert("⚠️ Username already exists.");
//   //     } else {
//   //       alert("⚠️ Email already exists.");
//   //     }
//   //     return;
//   //   }

//   //   // 模擬成功註冊
//   //   alert("✅ Registration successful! Please check your email to activate your account.");
//   //   navigate("/");

//   //   } catch (error) {
//   //     console.error("Error during registration:", error);
//   //     alert("⚠️ Unexpected error. Please try again.");
//   //     }
//   //   };


//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 relative overflow-hidden">
//       {/* 背景光暈 */}
//       <div className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-10 left-10"></div>
//       <div className="absolute w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-10 right-10"></div>

//       {/* 標題 */}
//       <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-10 tracking-wide drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
//         Event <span className="text-cyan-400">Planner</span>
//       </h1>

//       {/* 註冊卡片 */}
//       <div className="backdrop-blur-md bg-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-white/20 z-10">
//         <h2 className="text-2xl font-semibold text-center text-white mb-6 tracking-wide">
//           註冊帳號
//         </h2>

//         <input
//           type="text"
//           name="username"
//           placeholder="使用者名稱"
//           onChange={handleChange}
//           className="w-full p-3 mb-4 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="電子信箱"
//           onChange={handleChange}
//           className="w-full p-3 mb-4 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="密碼"
//           onChange={handleChange}
//           className="w-full p-3 mb-6 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
//         />

//         <button
//           onClick={handleRegister}
//           className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition font-semibold tracking-wide shadow-lg"
//         >
//           註冊
//         </button>

//         <button
//           onClick={() => navigate("/")}
//           className="w-full mt-4 text-cyan-300 hover:underline text-sm text-center"
//         >
//           已有帳號？前往登入
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;
