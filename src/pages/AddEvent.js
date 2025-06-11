import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slider";

const AddEvent = () => {
  // Task1:
  // TODO: 表單欄位狀態管理
  const [goal, setGoal] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState(50);
  const [audience, setAudience] = useState("");
  const [atmosphere, setAtmosphere] = useState("");

  const navigate = useNavigate();
  // Task1:
  // TODO: 當表單送出時，將資料 POST 到後端 API 並跳轉到下一頁
  // 假設已經送出表單到後端並得到回傳的 event names
  const handleSubmit = (e) => {
    e.preventDefault();

    // 假設後端回傳這些名稱
    const eventData = {
      goal,
      type,
      date,
      budget, // TODO: 創立滑桿，將滑桿值（0-100）轉換成實際預算（例如：5000）EX: budget: budget * 100,
      audience,
      atmosphere,
    };
    console.log("新增活動：", eventData);
  
// TODO: 串接API
 /*   try {
      const response = await fetch( url , {
        method: ..........,
        headers: {
          ............
        },
        body: .............,
      });

      const result = await response.json();
      console.log("成功送出活動：", result); // 檢查後端是否回傳成功訊息

      // TODO: 成功後跳轉到下一頁（可將結果傳給 ChooseName 頁面）
      // navigate("/choose-name", { state: { names: result.event_names || [] } }); // 傳假資料至後端
    } catch (error) {
      console.error("❌ 新增活動失敗：", error);
    }
  };

*/

    // 跳轉到choose-name並帶資料過去
    navigate("/choose-name", { state: { names: eventData } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white p-6">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/20">
        <h2 className="text-3xl font-bold mb-8 text-cyan-300 drop-shadow">
          Add New Event
        </h2>

        {/* Task1 : TODO: 表單輸入區塊 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Goal */}
          <input
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            type="text"
            placeholder="Event Goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
          />

          {/* Date */}
          <input
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          {/* Type */}
          <select
            className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="" disabled>Event Type</option>
            <option value="Workshop_Training">Workshop / Training</option>
            <option value="Social_Networking">Social / Networking</option>
            <option value="Performance_Showcase">Performance / Showcase</option>
            <option value="Speech_Seminar">Speech / Seminar</option>
            <option value="Recreational_Entertainment">Recreational / Entertainment</option>
            <option value="Market_Exhibition">Market / Exhibition</option>
            <option value="Competition_hallenge">Competition / Challenge</option>
          </select>

          {/* Task1 : 
          TODO: Budget 使用滑桿控制 React Slider（最大 100，實際會乘以 100） */}
          {/* Budget */}
          <div className="w-full max-w-md">
            <label className="block mb-2 text-sm text-cyan-200">Budget: ${budget}</label>
            {/* <Slider
              className="w-full h-2"
              value={budget}
              onChange={(value) => setBudget(value)}
              min={0}
              max={100}
              renderTrack={(props, state) => {
                const { key, ...restProps } = props;
                return (
                  <div
                    key={key}
                    {...restProps}
                    className={`h-2 rounded ${state.index === 0 ? "bg-cyan-500" : "bg-cyan-300"}`}
                  />
                );
              }}
              renderThumb={(props) => {
                const { key, ...restProps } = props;
                return (
                  <div
                    key={key}
                    {...restProps}
                    className="h-4 w-4 bg-white rounded-full shadow"
                  />
                );
              }}
            /> */}
          </div>



          {/* Audience */}
          <select
            className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            required
          >
            <option value="" disabled>Audience</option>
            <option value="Students_Young">Students / Young Adults</option>
            <option value="Professionals">Professionals</option>
            <option value="Families">Families</option>
            <option value="Local_Community">Local Community</option>
          </select>

          {/* Event atmosphere */}
          <select
            className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={atmosphere}
            onChange={(e) => setAtmosphere(e.target.value)}
            required
          >
            <option value="" disabled>Event atmosphere</option>
            <option value="Formal_Professional">Formal / Professional</option>
            <option value="Casual_Friendly">Casual / Friendly</option>
            <option value="Energetic_Fun">Energetic / Fun</option>
            <option value="Relaxed_Calm">Relaxed / Calm</option>
            <option value="Creative_Artistic">Creative / Artistic</option>
            <option value="Immersive_Interactive">Immersive / Interactive</option>
          </select>
          
          {/* Task1 : TODO: 點擊後觸發 handleSubmit，發送 POST 請求 */}
          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
            >
              Submit 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;