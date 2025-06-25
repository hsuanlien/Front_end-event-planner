import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [originalPassword, setOriginalPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");

  const [isEditable, setIsEditable] = useState(false); // ✅ 新增：控制是否能編輯

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/accounts/", {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user data");
        return res.json();
      })
      .then((data) => {
        setUsername(data.username || "");
        setEmail(data.email || "");
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setAddress(data.address || "");
        setOriginalPassword(data.password || "");
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        navigate("/login");
      });
  }, [navigate]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/accounts/account-update/", {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password: password || originalPassword,
          email,
          first_name: firstName,
          last_name: lastName,
          address,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ 資料更新成功");
        setPassword("");
        localStorage.setItem("currentUser", JSON.stringify(result.user));
        setOriginalPassword(result.user.password);
        setIsEditable(false); // ✅ 儲存成功後鎖定欄位
      } else {
        alert("❌ 更新失敗，請檢查資料或重新登入");
        console.error("Update failed:", result);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ 發生錯誤，請稍後再試");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow">User Profile</h2>
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg max-w-xl mx-auto space-y-4 border border-white/10">
        <input
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
          type="text"
          placeholder="Username"
          value={username}
          disabled // ✅ 一律唯讀
        />
        <input
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!isEditable} // ✅ 根據 isEditable 控制
        />
        <input
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
          type="password"
          placeholder="Change Password (leave blank to keep current)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={!isEditable}
        />
        <input
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={!isEditable}
        />
        <input
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={!isEditable}
        />
        <input
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={!isEditable}
        />

        {/* ✅ 編輯與儲存按鈕並排 */}
        <div className="flex justify-end space-x-4 pt-2">
          <button
            onClick={() => setIsEditable(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-semibold"
            disabled={isEditable} // 避免重複點擊
          >
            Edit
          </button>
          <button
            onClick={handleSave}
            className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-lg font-semibold"
            disabled={!isEditable} // 不可編輯時無法儲存
          >
            Save
          </button>
        </div>
      </div>

      {/* 左下角的返回按鈕 */}
      <button
        onClick={() => navigate(-1)}
        className="fixed bottom-4 left-4 h-12 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow border border-gray-400 z-50"
      >
        ← Back
      </button>
    </div>
  );
};

export default UserProfile;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const UserProfile = () => {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [originalPassword, setOriginalPassword] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [address, setAddress] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     fetch("http://127.0.0.1:8000/accounts/", {
//       headers: {
//         Authorization: `Token ${token}`,
//         "Content-Type": "application/json",
//       },
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch user data");
//         return res.json();
//       })
//       .then((data) => {
//         setUsername(data.username || "");
//         setEmail(data.email || "");
//         setFirstName(data.first_name || "");
//         setLastName(data.last_name || "");
//         setAddress(data.address || "");
//         setOriginalPassword(data.password || "");
//       })
//       .catch((err) => {
//         console.error("Fetch error:", err);
//         navigate("/login");
//       });
//   }, [navigate]);

//   const handleSave = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const response = await fetch("http://127.0.0.1:8000/accounts/account-update/", {
//         method: "PUT",
//         headers: {
//           Authorization: `Tokenc ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           username,
//           password: password || originalPassword,
//           email,
//           first_name: firstName,
//           last_name: lastName,
//           address,
//         }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         alert("✅ 資料更新成功");
//         setPassword("");
//         localStorage.setItem("currentUser", JSON.stringify(result.user));
//         setOriginalPassword(result.user.password);
//       } else {
//         alert("❌ 更新失敗，請檢查資料或重新登入");
//         console.error("Update failed:", result);
//       }
//     } catch (err) {
//       console.error("Save error:", err);
//       alert("❌ 發生錯誤，請稍後再試");
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
//       <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow">User Profile</h2>
//       <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg max-w-xl mx-auto space-y-4 border border-white/10">
//         <input
//           className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           disabled
//         />
//         <input
//           className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
//           type="password"
//           placeholder="Change Password (leave blank to keep current)"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <input
//           className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
//           type="text"
//           placeholder="First Name"
//           value={firstName}
//           onChange={(e) => setFirstName(e.target.value)}
//         />
//         <input
//           className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
//           type="text"
//           placeholder="Last Name"
//           value={lastName}
//           onChange={(e) => setLastName(e.target.value)}
//         />
//         <input
//           className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white"
//           type="text"
//           placeholder="Address"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//         />
//         <button
//           onClick={handleSave}
//           className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg font-semibold"
//         >
//         Save
//         </button>
//       </div>

//       {/* 固定在左下角的返回按鈕 */}
//       <button
//         onClick={() => navigate(-1)}
//         className="fixed bottom-4 left-4 h-12 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow border border-gray-400 z-50"
//       >
//         ← Back
//       </button>


//     </div>
//   );
// };

// export default UserProfile;