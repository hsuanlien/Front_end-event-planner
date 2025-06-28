// src/pages/EventDetailPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../config"; // 新增這行

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [versions, setVersions] = useState(["v1"]);
  const [selectedVersion, setSelectedVersion] = useState("v1");
  const [error, setError] = useState(null);
  const [eventOptions, setEventOptions] = useState({
    type: [],
    target_audience: [],
    atmosphere: [],
  });

  useEffect(() => {
    const fetchEvent = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API.EVENTS}/${id}`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          // 如果找不到資料，data 可能是 {} 或 undefined
          if (!data || Object.keys(data).length === 0) {
            setError("查無此活動資料");
            setEventData(null);
          } else {
            setEventData(data);
            setForm(data);
            // 產生版本陣列
            const vArr = [];
            for (let i = 1; i <= (data.latest_version || 1); i++) vArr.push(`v${i}`);
            setVersions(vArr);
            setError(null);
          }
        } else {
          setError("查無此活動資料");
          setEventData(null);
        }
      } catch (e) {
        setError("載入活動資料失敗");
        setEventData(null);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (eventData && eventData.versions) {
      const verData = eventData.versions.find(
        (v) => v.version === selectedVersion
      );
      setForm(verData ? { ...verData } : {});
    }
  }, [selectedVersion, eventData]);

  // 取得 event options
  useEffect(() => {
    const fetchOptions = async () => {
      const res = await fetch("http://localhost:3001/event_options");
      if (res.ok) {
        const data = await res.json();
        setEventOptions(data);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 欄位轉換表
  const TYPE_MAP = {
    "Workshop_Training": "Workshop / Training",
    "Social_Networking": "Social / Networking",
    "Performance_Showcase": "Performance / Showcase",
    "Speech_Seminar": "Speech / Seminar",
    "Recreational_Entertainment": "Recreational / Entertainment",
    "Market_Exhibition": "Market / Exhibition",
    "Competition_Challenge": "Competition / Challenge",
  };
  const AUDIENCE_MAP = {
    "Students_Young": "Students / Young Adults",
    "Professionals": "Professionals",
    "Families": "Families",
    "Local_Community": "Local Community",
  };
  const ATMOSPHERE_MAP = {
    "Formal_Professional": "Formal / Professional",
    "Casual_Friendly": "Casual / Friendly",
    "Energetic_Fun": "Energetic / Fun",
    "Relaxed_Calm": "Relaxed / Calm",
    "Creative_Artistic": "Creative / Artistic",
    "Immersive_Interactive": "Immersive / Interactive",
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    // 產生新版本號
    const newVersionNum = eventData.versions.length + 1;
    // 欄位轉換（送到後端前轉回原始格式）
    const newVersion = {
      ...form,
      version: `v${newVersionNum}`,
      type: Object.keys(TYPE_MAP).find(key => TYPE_MAP[key] === form.type) || form.type,
      target_audience: Object.keys(AUDIENCE_MAP).find(key => AUDIENCE_MAP[key] === form.target_audience) || form.target_audience,
      atmosphere: Object.keys(ATMOSPHERE_MAP).find(key => ATMOSPHERE_MAP[key] === form.atmosphere) || form.atmosphere,
    };
    const newEventData = {
      ...eventData,
      versions: [...eventData.versions, newVersion],
      latest_version: newVersionNum,
    };
    // PUT 更新整個 event
    const res = await fetch(`${API.EVENTS}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(newEventData),
    });
    if (res.ok) {
      // 儲存版本（呼叫 save-version API）
      await fetch(`${API.EVENTS}/${id}/save-version/`, {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
      });
      setEditMode(false);
      // 資料同步：重新 fetch 最新 event
      const updated = await fetch(`${API.EVENTS}/${id}`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (updated.ok) {
        const data = await updated.json();
        setEventData(data);
        setVersions(data.versions.map((v) => v.version));
        setSelectedVersion(`v${newVersionNum}`);
      }
    } else {
      alert("儲存失敗");
    }
  };

  const handleFunctionClick = (item) => {
    if (item === "海報") {
      // 跳轉到 Poster_info 頁面
      navigate(`/event/${id}/${selectedVersion}/poster-info`);
    } else if (item === "場地") {
      navigate(`/event/${id}/${selectedVersion}/venue`);
    } else if (item === "邀請函") {
      navigate(`/event/${id}/${selectedVersion}/invitation`);
    } else if (item === "文案") {
      navigate(`/event/${id}/${selectedVersion}/copywriting`);
    } else if (item === "報名表單") {
      navigate(`/event/${id}/${selectedVersion}/check-registration`);
      // /event/:id/:version/check-registration
    } else {
      console.log(`尚未設定 ${item} 的跳轉`);
    }
  };

  // 取得當前版本內容
  const currentVersionData = eventData?.versions?.find(
    (v) => v.version === selectedVersion
  );

  if (!eventData) return <div>Loading...</div>;

  // 顯示時欄位轉換
  const displayType = TYPE_MAP[currentVersionData?.type] || currentVersionData?.type;
  const displayAudience = AUDIENCE_MAP[currentVersionData?.target_audience] || currentVersionData?.target_audience;
  const displayAtmosphere = ATMOSPHERE_MAP[currentVersionData?.atmosphere] || currentVersionData?.atmosphere;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      {/* Left column: Versions */}
      <div className="w-32 p-4 border-r border-white/10 bg-white/5">
        <h3 className="text-md font-semibold mb-4 text-cyan-300">版本</h3>
        <ul className="space-y-2">
          {versions.map((ver) => (
            <li key={ver}>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg transition ${
                  selectedVersion === ver
                    ? "bg-cyan-600 text-white"
                    : "hover:bg-white/10 text-gray-300"
                }`}
                onClick={() => setSelectedVersion(ver)}
              >
                {ver.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Right side */}
      <div className="flex-1 flex">
        {/* Sidebar 功能選單 */}
        <div className="w-64 p-6 border-r border-white/10 bg-white/5">
          <h3 className="text-xl font-bold mb-4">📌 功能選單</h3>
          <ul className="space-y-2">
            {["場地", "報名表單", "邀請函", "文案", "海報"].map((item, index) => (
              <li
                key={index}
                className="p-2 rounded-xl hover:bg-white/20 cursor-pointer"
                onClick={() => handleFunctionClick(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Chatbox 區域 */}
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">
            🧾 Event {id} - {selectedVersion.toUpperCase()}
          </h2>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl h-[400px] overflow-y-auto shadow-inner">
            {error ? (
              <div className="text-red-400 text-lg">{error}</div>
            ) : eventData ? (
              editMode ? (
                <form className="space-y-4">
                  <input
                    name="name"
                    value={form.name || ""}
                    onChange={handleChange}
                    className="w-full p-2 rounded text-black"
                  />
                  <textarea
                    name="description"
                    value={form.description || ""}
                    onChange={handleChange}
                    className="w-full p-2 rounded text-black"
                  />
                  <select
                    name="type"
                    value={form.type || ""}
                    onChange={handleChange}
                    className="w-full p-2 rounded text-black"
                  >
                    <option value="" disabled>Event Type</option>
                    {eventOptions.type.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <select
                    name="target_audience"
                    value={form.target_audience || ""}
                    onChange={handleChange}
                    className="w-full p-2 rounded text-black"
                  >
                    <option value="" disabled>Audience</option>
                    {eventOptions.target_audience.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <select
                    name="atmosphere"
                    value={form.atmosphere || ""}
                    onChange={handleChange}
                    className="w-full p-2 rounded text-black"
                  >
                    <option value="" disabled>Atmosphere</option>
                    {eventOptions.atmosphere.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {/* 其他欄位... */}
                </form>
              ) : (
                <>
                  <h3 className="text-xl font-bold">{currentVersionData?.name}</h3>
                  <div className="mb-2">
                    {(currentVersionData?.description || "")
                      // 先用 \n 分段，如果沒有就每80字切一段
                      .split('\n').flatMap(line =>
                        line.length > 80
                          ? line.match(/.{1,80}/g) // 每80字切一段
                          : [line]
                      )
                      .map((line, idx) => (
                        <p key={idx} className="mb-2 break-words">{line}</p>
                      ))}
                  </div>
                  <div>類型：{displayType}</div>
                  <div>對象：{displayAudience}</div>
                  <div>氛圍：{displayAtmosphere}</div>
                  {/* 其他欄位... */}
                </>
              )
            ) : (
              <div className="text-gray-300">載入中...</div>
            )}
          </div>
          <div className="flex gap-10 mt-4">
            <button
              onClick={() => setEditMode(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
              disabled={editMode || !!error}
            >
              Change
            </button>
            <button
              onClick={handleSave}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
              disabled={!editMode || !!error}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
