import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CheckCopywriting = () => {
  const navigate = useNavigate();
  const { id, version } = useParams();
  const [selected, setSelected] = useState("");
  const names = [
    // "Unity Fest",
    // "Campus Connect",
    // "Together 2025",
    // "Student Pulse",
    // "Youth Link"
  ];

 //0618Task2
    const handleConfirm = () => {
        
    };

    const handleSave = () => {
      // ...儲存邏輯...
      navigate(`/event/${id}`);
    };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
      <main className="flex-1 flex flex-col p-8">
        <h1 className="text-3xl font-bold mb-6 drop-shadow-md">
          🎯 Check Copywriting
        </h1>


        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-inner space-y-4 max-w-xl">
          {names.map((name, idx) => (
            <label
              key={idx}
              className={`block p-4 rounded-lg cursor-pointer border ${
                selected === name
                  ? "bg-cyan-500 text-white border-cyan-400"
                  : "bg-white text-black border-white/50 hover:bg-cyan-100 transition"
              }`}
            >
              <input
                type="radio"
                name="eventName"
                value={name}
                onChange={() => setSelected(name)}
                className="mr-2"
              />
              {name}
            </label>
          ))}
        </div>


    {/* Task:按鈕寫法 */}
    {/* 底部按鈕區：flex 分左右 */}
        <div className="mt-8 flex justify-between items-center">
            {/* 左下角返回按鈕 */}
            <button
              onClick={() => navigate(`/event/${id}`)}
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
                    onClick={handleSave}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
                    >
                    Save
                    </button>
            </div>
        </div>



      </main>
    </div>
  );
};

export default CheckCopywriting;
