import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = "http://localhost:8000"; // json-server base

// const API_BASE = "http://127.0.0.1:8000/api"; // Django API base
const ChooseEventTime = () => {
  const { id, version } = useParams();
  const navigate = useNavigate();
  const nowISOString = new Date().toISOString(); // 目前時間

  const [eventDate, setEventDate] = useState("");
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
  });


  useEffect(() => {
    const fetchEventDate = async () => {
      try {
        const res = await fetch(`${API_BASE}/events/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.start_time) {
            const dateOnly = data.start_time.split("T")[0];
            setEventDate(dateOnly);
          }
        } else {
          console.error("無法載入活動資料");
        }
      } catch (error) {
        console.error("發生錯誤：", error);
      }
    };

    fetchEventDate();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { startTime, endTime } = formData;

    if (!startTime || !endTime) {
      alert("請選擇開始與結束時間");
      return;
    }

    if (startTime >= endTime) {
      alert("開始時間必須早於結束時間！");
      return;
    }

    try {
      // PATCH 可能不支援，json-server 可用 PUT
      const res = await fetch(`${API_BASE}/events/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_time: `${eventDate}T${startTime}`,
          end_time: `${eventDate}T${endTime}`,
        }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("更新成功：", data);
      navigate(`/event/${id}`, { state: { timeRange: formData } });
    } else {
      const err = await res.text();
      console.error("更新失敗：", err);
      alert("更新失敗");
    }
  } catch (error) {
    console.error("錯誤發生：", error);
  }
};

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white p-8">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-cyan-300">
          🕒 Event {id} - Choose Time Period
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block mb-2 text-white font-semibold">開始時間</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-white font-semibold">結束時間</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow border border-gray-400"
        >
          ← 返回
        </button>

        <div className="flex gap-10">
          <button
            onClick={() => alert("Change clicked")}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
          >
            Change
          </button>
          <button
            onClick={handleSubmit}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseEventTime;




// import React, { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// const ChooseEventTime = () => {
//   const { id, version } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     startTime: "",
//     endTime: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = () => {
//     const { startTime, endTime } = formData;

//     if (!startTime || !endTime) {
//       alert("請選擇開始與結束時間");
//       return;
//     }

//     if (startTime >= endTime) {
//       alert("開始時間必須早於結束時間！");
//       return;
//     }

//     console.log("送出的資料:", formData);

//     navigate(`/event/${id}`, {
//       state: { timeRange: formData },
//     });
//   };

//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white p-8">
//       <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl">
//         <h2 className="text-3xl font-bold mb-6 text-cyan-300">
//           🕒 Event {id} - Choose Time Period
//         </h2>

//         {/* Time Inputs */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
//           <div>
//             <label className="block mb-2 text-white font-semibold">開始時間</label>
//             <input
//               type="time"
//               name="startTime"
//               value={formData.startTime}
//               onChange={handleChange}
//               className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-2 text-white font-semibold">結束時間</label>
//             <input
//               type="time"
//               name="endTime"
//               value={formData.endTime}
//               onChange={handleChange}
//               className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//               required
//             />
//           </div>
//         </div>
//       </div>

//       {/* 按鈕區塊 */}
//       <div className="mt-8 flex justify-between items-center">
//         <button
//           onClick={() => navigate(-1)}
//           className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow border border-gray-400"
//         >
//           ← 返回
//         </button>

//         <div className="flex gap-10">
//           <button
//             onClick={() => alert("Change clicked")}
//             className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
//           >
//             Change
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChooseEventTime;