import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
 // hihi * AddEvent
/**
 * AddEvent
 * 完成 Task‑1：
 * 1. 表單欄位雙向繫結
 * 2. Budget 使用 React‑Slider（0‑100）×100 → 實際金額
 * 3. 送出時附帶 Token 進行 POST，成功後跳轉到 ChooseName
 */

// filepath: src/pages/AddEvent.js
// ...existing code...
// const API_URL = "http://localhost:8000/ai/generate-event/";
const API_URL = "http://localhost:3001/events";
// ...existing code...
// const API_URL = "https://your-backend-url.com/api/events"; // 替換為實際後端 API URL

const AddEvent = () => {
  
  /* 表單欄位狀態管理 */
  const [goal, setGoal] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState(50); // 0‑100 → 0‑10000 (×100)
  const [audience, setAudience] = useState("");
  const [atmosphere, setAtmosphere] = useState("");

  const navigate = useNavigate();

  /**
   * 送出表單 → 呼叫後端 API
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("請先登入！");
      return;
    }
    const payload = {
      goal: goal.trim(),
      type,
      date,
      budget: budget * 100,
      target_audience: audience,
      atmosphere,
    };
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status} – ${txt}`);
      }
      const data = await res.json();
      navigate("/choose-name", {
        state: {
          eventId: data.event_id,
          names: data.name,
          description: data.description,
          slogans: data.slogan,
        },
      });
    } catch (err) {
      alert("新增活動失敗，請稍後再試或檢查主控台錯誤。");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white p-6">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/20">
        <h2 className="text-3xl font-bold mb-8 text-cyan-300 drop-shadow">
          Add New Event{" "}
        </h2>
        {/* 表單 */}{" "}
        <form onSubmit={handleSubmit} className="space-y-6">
          {" "}
          {/* Goal */}{" "}
          <input
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            type="text"
            placeholder="Event Goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
          />
          {/* Date */}{" "}
          <input
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          {/* Type */}{" "}
          <select
            className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="" disabled>
              Event Type{" "}
            </option>{" "}
            <option value="Workshop_Training"> Workshop / Training </option>{" "}
            <option value="Social_Networking"> Social / Networking </option>{" "}
            <option value="Performance_Showcase">
              {" "}
              Performance / Showcase{" "}
            </option>{" "}
            <option value="Speech_Seminar"> Speech / Seminar </option>{" "}
            <option value="Recreational_Entertainment">
              Recreational / Entertainment{" "}
            </option>{" "}
            <option value="Market_Exhibition"> Market / Exhibition </option>{" "}
            <option value="Competition_Challenge">
              {" "}
              Competition / Challenge{" "}
            </option>{" "}
          </select>
          {/* Budget Slider 0‑100 (×100) */}
          <label>
            預算（budget）：{budget} 元
            <input
              type="range"
              min={1000}
              max={10000}
              step={500}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              style={{ width: "300px", marginLeft: "10px" }}
            />
          </label>
          {/* Audience */}{" "}
          <select
            className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            required
          >
            <option value="" disabled>
              Audience{" "}
            </option>{" "}
            <option value="Students_Young"> Students / Young Adults </option>{" "}
            <option value="Professionals"> Professionals </option>{" "}
            <option value="Families"> Families </option>{" "}
            <option value="Local_Community"> Local Community </option>{" "}
          </select>
          {/* Atmosphere */}{" "}
          <select
            className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={atmosphere}
            onChange={(e) => setAtmosphere(e.target.value)}
            required
          >
            <option value="" disabled>
              Event atmosphere{" "}
            </option>{" "}
            <option value="Formal_Professional"> Formal / Professional </option>{" "}
            <option value="Casual_Friendly"> Casual / Friendly </option>{" "}
            <option value="Energetic_Fun"> Energetic / Fun </option>{" "}
            <option value="Relaxed_Calm"> Relaxed / Calm </option>{" "}
            <option value="Creative_Artistic"> Creative / Artistic </option>{" "}
            <option value="Immersive_Interactive">
              {" "}
              Immersive / Interactive{" "}
            </option>{" "}
          </select>
          {/* Submit */}{" "}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
            >
              Submit{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
};

export default AddEvent;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Slider from "react-slider";
// import axios from "axios";

// const AddEvent = () => {
//   const [goal, setGoal] = useState("");
//   const [type, setType] = useState("");
//   const [date, setDate] = useState("");
//   const [budget, setBudget] = useState(50);
//   const [audience, setAudience] = useState("");
//   const [atmosphere, setAtmosphere] = useState("");

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("尚未登入，請先登入！");
//       return;
//     }

//     const postData = {
//       goal,
//       type,
//       date,
//       budget,
//       target_audience: audience,
//       atmosphere,
//     };

//     console.log("送出的活動資料：", postData);

//     try {
//       const response = await axios.post(
//         "http://localhost:8000/ai/generate-event/",
//         postData,
//         {
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         }
//       );

//       if (response.status === 201) {
//         console.log("活動建立成功：", response.data);
//         navigate("/choose-name", { state: response.data });
//       }
//     } catch (error) {
//       console.error("建立活動失敗：", error.response || error.message);
//       if (error.response?.status === 401) {
//         alert("驗證失敗：請重新登入");
//       } else {
//         alert("建立活動時發生錯誤");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white p-6">
//       <div className="w-full max-w-xl bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/20">
//         <h2 className="text-3xl font-bold mb-8 text-cyan-300 drop-shadow">Add New Event</h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <input
//             className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//             type="text"
//             placeholder="Event Goal"
//             value={goal}
//             onChange={(e) => setGoal(e.target.value)}
//             required
//           />

//           <input
//             className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             required
//           />

//           <select
//             className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//             value={type}
//             onChange={(e) => setType(e.target.value)}
//             required
//           >
//             <option value="" disabled>Event Type</option>
//             <option value="Workshop_Training">Workshop / Training</option>
//             <option value="Social_Networking">Social / Networking</option>
//             <option value="Performance_Showcase">Performance / Showcase</option>
//             <option value="Speech_Seminar">Speech / Seminar</option>
//             <option value="Recreational_Entertainment">Recreational / Entertainment</option>
//             <option value="Market_Exhibition">Market / Exhibition</option>
//             <option value="Competition_hallenge">Competition / Challenge</option>
//           </select>

//           <div className="w-full max-w-md">
//             <label className="block mb-2 text-sm text-cyan-200">Budget: ${budget * 100}</label>
//             <Slider
//               className="w-full h-2"
//               value={budget}
//               onChange={(value) => setBudget(value)}
//               min={0}
//               max={100}
//               // renderTrack={(props, state) => (
//               //   <div
//               //     {...props}
//               //     className={`h-2 rounded ${state.index === 0 ? "bg-cyan-500" : "bg-cyan-300"}`}
//               //   />
//               // )}
//               // renderThumb={(props) => (
//               //   <div
//               //     {...props}
//               //     className="h-4 w-4 bg-white rounded-full shadow"
//               //   />
//               // )}
//             />
//           </div>

//           <select
//             className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//             value={audience}
//             onChange={(e) => setAudience(e.target.value)}
//             required
//           >
//             <option value="" disabled>Audience</option>
//             <option value="Students_Young">Students / Young Adults</option>
//             <option value="Professionals">Professionals</option>
//             <option value="Families">Families</option>
//             <option value="Local_Community">Local Community</option>
//           </select>

//           <select
//             className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//             value={atmosphere}
//             onChange={(e) => setAtmosphere(e.target.value)}
//             required
//           >
//             <option value="" disabled>Event atmosphere</option>
//             <option value="Formal_Professional">Formal / Professional</option>
//             <option value="Casual_Friendly">Casual / Friendly</option>
//             <option value="Energetic_Fun">Energetic / Fun</option>
//             <option value="Relaxed_Calm">Relaxed / Calm</option>
//             <option value="Creative_Artistic">Creative / Artistic</option>
//             <option value="Immersive_Interactive">Immersive / Interactive</option>
//           </select>

//           <div className="flex justify-end pt-2">
//             <button
//               type="submit"
//               className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddEvent;


