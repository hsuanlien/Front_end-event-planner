import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Venue = () => {
  const { id, version } = useParams();
  const navigate = useNavigate();
  //  新增：場地資料欄位
  const [venueName, setVenueName] = useState("");
  const [radiusKm, setRadiusKm] = useState("");
  const [venueMessage, setVenueMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVenueSave = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    if (!venueName || !radiusKm) {
      setVenueMessage("請填寫所有欄位");
      setIsSubmitting(false); //  防止按鈕卡住
      return;
    }
    const token = localStorage.getItem("access_token"); // 假設你登入後存在這裡 
    //console.log("venue", token);
    // @@venue ID沒有get, 沒辦法更新
    try {
      const res = await fetch(`https://genai-backend-2gji.onrender.com/ai/generate-venues/${id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: venueName,
          radius_km: Number(radiusKm),
        }),
    });

    if (!res.ok) {
      if (res.status === 403) {
        throw new Error("權限不足，請重新登入");
      }
      throw new Error("提交失敗");
    }
    const data = await res.json();
    console.log("✅ 後端回傳場地建議：", data.venue_suggestions);
    if (!data.venue_suggestions || !Array.isArray(data.venue_suggestions)) {
      throw new Error("後端資料格式錯誤");
    }
    // ✅ 先顯示成功訊息
    setVenueMessage("✅ Submission successful!");


    // ✅ 帶資料跳轉
      navigate(`/event/${id}/choose-venue`, {
        state: {
          venue_suggestions: data.venue_suggestions,
          eventId: id, // 從 useParams 傳來即可
        },
      });
    } catch (err) {
      console.error(err);
      setVenueMessage("❌ Submission failed, please check the server.");
    }

    setIsSubmitting(false); // 在 finally 或每個路徑最後都呼叫
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
          {/* <button
            onClick={() => alert("Change clicked")}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
          >
            Change
          </button> */}
          
{/* 儲存按鈕點擊後應禁用，避免多次提交 */}
         <button
            onClick={handleVenueSave}
            disabled={isSubmitting}
            className={`bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Venue