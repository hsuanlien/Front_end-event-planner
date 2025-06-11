import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChooseName = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const names = [
    "Unity Fest",
    "Campus Connect",
    "Together 2025",
    "Student Pulse",
    "Youth Link"
  ];
 // Task2  TODO:
 // const [names, setNames] = useState([]);
 // useEffect(() => {
    // Task2
    // TODO: 向後端 API 發送 GET 請求，取得 5 個 event names
    // URL
    // Header: Authorization: Token xxx
    // 回傳後儲存到 setNames([...])
    // 預設第一個選項為 selected 狀態
  //}, []);
    const handleConfirm = () => {
        // Task2
        // TODO: 將使用者選擇的 event name 存入狀態或傳遞至下一頁
        // TODO: 點擊後跳轉至 ChooseSlogan 頁面
        navigate("/choose-slogan");
    };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
      <main className="flex-1 flex flex-col p-8">
        <h1 className="text-3xl font-bold mb-6 drop-shadow-md">
          🎯 Choose Event Name
        </h1>

{/* Task2 TODO: 改用從後端取得的 event name list，而非硬寫上去 */}
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

        <div className="flex justify-end pt-6">
          <button
            // Task2 
            // 改成：onClick={handleConfirm}
            onClick={() => navigate("/choose-slogan")}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
          >
            確認
          </button>
        </div>
      </main>
    </div>
  );
};

export default ChooseName;
