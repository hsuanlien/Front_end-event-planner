import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Event_Description = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    eventId,
    eventName,
    selectedSlogan,
    description,
    expected_attendees,
    suggested_time,
    suggested_event_duration,
  } = location.state || {};

  const token = localStorage.getItem("token");

  const handleConfirm = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/events/${eventId}/update/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            name: eventName,
            slogan: selectedSlogan,
            description,
            expected_attendees,
            suggested_time,
            suggested_event_duration,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("✅ 活動更新成功：", result);
        navigate("/home");
      } else {
        const errorText = await response.text();
        console.error("❌ 更新失敗：", errorText);
      }
    } catch (err) {
      console.error("❌ 發送 PATCH 請求錯誤：", err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
      <main className="flex-1 flex flex-col p-8">
        <h1 className="text-3xl font-bold mb-6 drop-shadow-md">
          📝 Event Description
        </h1>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-inner max-w-xl space-y-4">
          <div>
            <strong className="text-cyan-400">活動名稱：</strong> {eventName}
          </div>
          <div>
            <strong className="text-cyan-400">標語：</strong> {selectedSlogan}
          </div>
          <div>
            <strong className="text-cyan-400">預計人數：</strong> {expected_attendees}
          </div>
          <div>
            <strong className="text-cyan-400">建議時間：</strong> {suggested_time}（共 {suggested_event_duration}）
          </div>
          <div>
            <strong className="text-cyan-400">活動描述：</strong>
            <p className="mt-2 whitespace-pre-line">{description}</p>
          </div>
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

export default Event_Description;


// import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// const Event_Description = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const {
//     eventId,
//     eventName,
//     selectedSlogan,
//     description,
//     expected_attendees,
//     suggested_time,
//     suggested_event_duration,
//   } = location.state || {};

//   const token = localStorage.getItem("token"); // ⬅️ 建議從 localStorage 取得 token

//   const handleConfirm = async () => {
//     try {
//       const response = await fetch("http://127.0.0.1:8000/ai/confirm-event/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//         },
//         body: JSON.stringify({
//           event_id: eventId,
//           name: eventName,
//           slogan: selectedSlogan,
//           description,
//           expected_attendees,
//           suggested_time,
//           suggested_event_duration,
//         }),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log("✅ 活動已確認：", result);
//         navigate("/home");
//       } else {
//         console.error("❌ 確認失敗", await response.text());
//       }
//     } catch (err) {
//       console.error("❌ 發送請求失敗", err);
//     }
//   };

//   return (
//     <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
//       <main className="flex-1 flex flex-col p-8">
//         <h1 className="text-3xl font-bold mb-6 drop-shadow-md">
//           📝 Event Description
//         </h1>
//         <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-inner max-w-xl space-y-4">
//           <div>
//             <strong className="text-cyan-400">活動名稱：</strong> {eventName}
//           </div>
//           <div>
//             <strong className="text-cyan-400">標語：</strong> {selectedSlogan}
//           </div>
//           <div>
//             <strong className="text-cyan-400">預計人數：</strong> {expected_attendees}
//           </div>
//           <div>
//             <strong className="text-cyan-400">建議時間：</strong> {suggested_time}（共 {suggested_event_duration}）
//           </div>
//           <div>
//             <strong className="text-cyan-400">活動描述：</strong>
//             <p className="mt-2 whitespace-pre-line">{description}</p>
//           </div>
//         </div>
//         <div className="flex justify-end pt-6">
//           <button
//             onClick={handleConfirm}
//             className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
//           >
//             確認
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Event_Description;

/*
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Event_Description = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventName, slogan } = location.state || {};
  const [description, setDescription] = useState("");

  useEffect(() => {
    // 取得對應 event name 的 description
    fetch("http://localhost:3001/events")
      .then(res => res.json())
      .then(data => {
        const event = data[0];
        setDescription(event?.description || "");
      });
  }, []);

  const handleConfirm = async () => {
    // 送出 eventName, slogan, description 到後端
    const token = "c072fc90dc5ac75e8c500ddc1c2cdf09ef728d6b";
    await fetch("http://localhost:3001/selected", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        name: eventName,
        slogan,
        description,
      }),
    });
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
      <main className="flex-1 flex flex-col p-8">
        <h1 className="text-3xl font-bold mb-6 drop-shadow-md">
          📝 Event Description
        </h1>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-inner max-w-xl">
          <p className="text-white text-lg whitespace-pre-line">{description}</p>
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

export default Event_Description;  */