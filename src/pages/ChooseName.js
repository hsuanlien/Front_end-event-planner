import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ChooseName = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { names = [], eventId, slogan, description, expected_attendees, suggested_time, suggested_event_duration } = location.state || {};

  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (names.length > 0) {
      setSelected(names[0]);
    }
  }, [names]);

  const handleConfirm = () => {
    // 帶上選擇的 event name 和其他 event 資訊繼續前往下一頁
    navigate("/choose-slogan", {
      state: {
        eventId,
        selectedName: selected,
        slogan,
        description,
        expected_attendees,
        suggested_time,
        suggested_event_duration,
      },
    });
  };

  if (!names.length) {
    return (
      <div className="text-white text-center p-8">
        <h1 className="text-2xl">❌ 找不到 event 名稱，請重新從建立活動開始</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
      <main className="flex-1 flex flex-col p-8">
        <h1 className="text-3xl font-bold mb-6 drop-shadow-md">
          🎯 Choose Event Name
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
                checked={selected === name}
                onChange={() => setSelected(name)}
                className="mr-2"
              />
              {name}
            </label>
          ))}
        </div>
        <div className="flex justify-end pt-6">
          <button
            onClick={handleConfirm}
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

/*
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChooseName = () => {
  const navigate = useNavigate();
  const [names, setNames] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    // 假設 db.json 由 json-server 提供 http://localhost:3001/events
    fetch("http://localhost:3001/events")
      .then(res => res.json())
      .then(data => {
        // 取第一筆 event 的 name 陣列
        const eventNames = data[0]?.name || [];
        setNames(eventNames);
        setSelected(eventNames[0] || "");
      });
  }, []);

  const handleConfirm = () => {
    // 將選擇的 event name 傳到下一頁
    navigate("/choose-slogan", { state: { eventName: selected } });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
      <main className="flex-1 flex flex-col p-8">
        <h1 className="text-3xl font-bold mb-6 drop-shadow-md">
          🎯 Choose Event Name
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
                checked={selected === name}
                onChange={() => setSelected(name)}
                className="mr-2"
              />
              {name}
            </label>
          ))}
        </div>
        <div className="flex justify-end pt-6">
          <button
            onClick={handleConfirm}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
          >
            確認
          </button>
        </div>
      </main>
    </div>
  );
};

export default ChooseName; */
