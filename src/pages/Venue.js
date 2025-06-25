import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// 0618Task4
const Venue = () => {
  const { id, version } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tone: "",
    language: "",
    version_count: "",
    platform: "poster",
    word_limit: "",
    reward: "",
    keywords_to_emphasize: "",
  });

  useEffect(() => {
    fetch("http://localhost:3001/venues")
      .then((res) => {
        if (!res.ok) throw new Error("連接後端失敗");
        return res.json();
      })
      .then((data) => {
        console.log("✅ 成功連接 db.json，已有資料：", data);
      })
      .catch((err) => {
        console.error("❌ 無法連線 db.json", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("送出的資料:", formData);
    navigate(`/event/${id}/${version}/venue-template`);
  };

  // ✅ 新增：場地資料欄位
  const [venueName, setVenueName] = useState("");
  const [radiusKm, setRadiusKm] = useState("");
  const [venueMessage, setVenueMessage] = useState("");

const handleVenueSave = async () => {
  if (!venueName || !radiusKm) {
    setVenueMessage("請填寫所有欄位");
    return;
  }

  try {
    const res = await fetch("http://localhost:3001/venues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: venueName,
        radius_km: Number(radiusKm)
      })
    });

    if (!res.ok) throw new Error("提交失敗");

    // ✅ 先顯示成功訊息
    setVenueMessage("✅ 提交成功！");

    // ✅ 延遲 1 秒後跳轉頁面
    setTimeout(() => {
      navigate(`/event/${id}/${version}/choose-venue`);
    }, 1000);
  } catch (err) {
    console.error(err);
    setVenueMessage("❌ 提交失敗，請檢查伺服器");
  }
};

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white p-8">
  

      {/* ✅ 新增場地輸入區塊 */}
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl mt-10">
        <h3 className="text-2xl font-bold mb-4 text-yellow-300">🏗️ Create Venue</h3>

        <label className="block mb-2 text-white font-medium">📍 Location Name</label>
        <input
          type="text"
          value={venueName}
          onChange={(e) => setVenueName(e.target.value)}
          placeholder="Enter location"
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none"
        />

        <label className="block mb-2 text-white font-medium">📏 Radius (km)</label>
        <input
          type="text"
          value={radiusKm}
          onChange={(e) => setRadiusKm(e.target.value)}
          placeholder="Enter radius"
          className="w-full mb-4 p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none"
        />

        {venueMessage && (
          <p className="text-center text-yellow-300 mt-4">{venueMessage}</p>
        )}
      </div>

      {/* Task:按鈕寫法 */}
      {/* 底部按鈕區：flex 分左右 */}
      <div className="mt-8 flex justify-between items-center">
        {/* 左下角返回按鈕 */}
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow border border-gray-400"
        >
          ← 返回
        </button>

        {/* 右下角 Add / Change / Save 按鈕 */}
        <div className="flex gap-10">
          <button
            onClick={() => alert("Change clicked")}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
          >
            Change
          </button>
          <button
            onClick={handleVenueSave}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Venue


// import React, { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// // 0618Task4
// const Venue = () => {
//   const { id, version } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     tone: "",
//     language: "",
//     version_count: "",
//     platform: "poster",
//     word_limit: "",
//     reward: "",
//     keywords_to_emphasize: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = () => {
//     console.log("送出的資料:", formData);
//     navigate(`/event/${id}/${version}/venue-template`);
//   };

//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white p-8">
//       <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl">
//         <h2 className="text-3xl font-bold mb-6 text-cyan-300">
//           🎨 Event {id} - {version.toUpperCase()} Venue Info
//         </h2>

//         <div className="grid grid-cols-1 gap-4">
//           {[
//             ["tone", "語氣 (如 youthful)"],
//             ["language", "語言 (如 zh_tw)"],
//             ["version_count", "版本數量"],
//             ["word_limit", "字數上限"],
//             ["reward", "獎勵說明 (如 First prize: EUR$500)"],
//             ["keywords_to_emphasize", "強調關鍵字 (以逗號分隔)"],
//           ].map(([key, label]) => (
//             <div key={key}>
//               <label className="block mb-1 text-sm text-gray-300">{label}</label>
//               <input
//                 type="text"
//                 name={key}
//                 value={formData[key]}
//                 onChange={handleChange}
//                 className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//               />
//             </div>
//           ))}
//         </div>

//       </div>

//     {/* Task:按鈕寫法 */}
//       <div className="mt-8 flex justify-between items-center">
//         {/* 左下角返回按鈕 */}
//         <button
//           onClick={() => navigate(-1)}    
//           className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow border border-gray-400"
//         >
//           ← 返回
//         </button>

//         {/* 右下角 Add / Change / Save 按鈕 */}
//         <div className="flex gap-10">
//           <button
//             onClick={() => alert("Change clicked")}
//             className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
//           >
//             Change
//           </button>
//           <button
//             onClick={() => navigate("/event/:id/:version/choose-venue")}
//             className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
//           >
//             Save
//           </button>
//         </div>
//       </div>



//     </div>
//   );
// };

// export default Venue;