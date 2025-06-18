import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ChooseEventTime = () => {
  const { id, version } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { startTime, endTime } = formData;

    if (!startTime || !endTime) {
      alert("請選擇開始與結束時間");
      return;
    }

    if (startTime >= endTime) {
      alert("開始時間必須早於結束時間！");
      return;
    }

    console.log("送出的資料:", formData);

    navigate(`/event/:id`, {
      state: { timeRange: formData },
    });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white p-8">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-cyan-300">
          🕒 Event {id} - Choose Time Period
        </h2>

        {/* Time Inputs */}
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

      {/* 按鈕區塊 */}
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
// // 
// const ChooseEventTime = () => {
//   const { id, version } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
    
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
//           🎨 Event {id} - Choose time period
//         </h2>

        

//       </div>

//     {/* Task:按鈕寫法 */}
//     {/* 底部按鈕區：flex 分左右 */}
//       <div className="mt-8 flex justify-between items-center">
//         {/* 左下角返回按鈕 */}
//         <button
//           onClick={() => navigate(-1)}    
//           className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow border border-gray-400"
//         >
//           ← 返回
//         </button>

//       {/* 右下角 Add / Change / Save 按鈕 */}
//         <div className="flex gap-10">
//           <button
//             onClick={() => alert("Change clicked")}
//             className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
//           >
//             Change
//           </button>
//           <button
//             //onClick={() => alert("Save clicked")}
//             onClick={() => navigate("/event/:id")}
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