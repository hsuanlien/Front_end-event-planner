// src/pages/UserProfile.js
import React, { useState } from "react";

const UserProfile = () => {
// 個人資料欄位
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("");
  // Task4 
  // TODO 在個人資料欄位, 新增使用者資料欄位
  // const [username, setUsername] = useState("");
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // ........

  const handleSave = () => {
    alert("資料已更新！");
    // 儲存 API 邏輯
  };


 // Task4 
 // TODO 取得使用者資料
  // useEffect(() => {
  //   const token = .....;
  //   if (!token) return;

  //   fetch("url", {
  //     headers: {
  //       Authorization: `Token ${token}`,
  //     },
  //   })
  //     .then(res => res.json()) // 將回應轉為 JSON
  //     .then(data => {
  //       // 載入使用者資料到表單
  //       setUsername(data.username);
  //       setFirstName(data.first_name);
  //       ......
  //     })
  //     .catch(() => {
  //       alert("無法取得使用者資料，請重新登入");
  //     });
  // }, []);

// Task4 
 // TODO 儲存修改
  // const handleSave = async () => {
  //   const token = ....
  //   if (!token) return;

  //   try {
  //     const response = await fetch("url", {
  //       method: "PUT",
  //       headers: {
  //        ...
  //       },
  //       body: JSON.stringify({
  //         username,
  //         email,
  //         .......
  //         password: password || undefined, // 如果沒有修改密碼，就不送出
  //       }),
  //     });

  //     if (response.ok) {
  //       
  //     } else {
  //       
  //     }
  //   } catch {
  //     alert("無法連線後端");
  //   }
  // };


  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow">👤 User Profile</h2>
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg max-w-xl mx-auto space-y-4 border border-white/10">
        {/* Task4 TODO: modify input logic if you need*/}
        <input
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          // disabled // 不讓使用者修改帳號
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
        {/* Task4 TODO: Add input by yourself */}
        {/* <input
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
          type=...
          placeholder="....
          value={....}
          onChange={(e) => .....
        /> */}

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
