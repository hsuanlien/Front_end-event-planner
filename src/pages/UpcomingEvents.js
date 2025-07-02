// src/pages/UpcomingEvents.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://genai-backend-2gji.onrender.com/api"; // Django API base

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_BASE}/events/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("無法載入活動，請檢查登入或權限");
        }

        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleClick = (id) => {
    navigate(`/event/${id}/choose-event-time`);
  };

  if (loading) return <div className="text-gray-300">載入中...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow">
        📅 Upcoming Events
      </h2>
      <ul className="space-y-4 max-w-xl mx-auto">
        {events.map((event) => {
          const displayName = event.name || "（未命名活動）";
          const displayDate = event.start_time?.slice(0, 10) || "未知日期";

          return (
            <li
              key={event.id}
              onClick={() => handleClick(event.id)}
              className="cursor-pointer bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow border border-white/10 flex justify-between items-center hover:bg-white/20 transition"
            >
              <span className="font-medium text-white">{displayName}</span>
              <span className="text-sm text-white/70">{displayDate}</span>
            </li>
          );
        })}
      </ul>


    </div>
  );
};

export default UpcomingEvents;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const API_BASE = "https://genai-backend-2gji.onrender.com/api";

// const UpcomingEvents = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModalDelete, setShowModalDelete] = useState(false);
//   const [selectedEventId, setSelectedEventId] = useState("");

//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");

//   // 取得活動列表
//   useEffect(() => {
//     const fetchEvents = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`${API_BASE}/events/`, {
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         });

//         if (!res.ok) {
//           throw new Error("無法載入活動，請檢查登入或權限");
//         }

//         const data = await res.json();
//         setEvents(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, [token]);

//   const handleClick = (id) => {
//     navigate(`/event/${id}/choose-event-time`);
//   };

//   const handleConfirmDelete = async () => {
//     if (!selectedEventId) return;

//     try {
//       const res = await fetch(`${API_BASE}/events/${selectedEventId}/delete/`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Token ${token}`,
//         },
//       });

//       if (res.status === 204) {
//         alert("活動已刪除");
//         setShowModalDelete(false);
//         setSelectedEventId("");

//         // 重新載入活動
//         const updatedEvents = events.filter(e => e.id !== parseInt(selectedEventId));
//         setEvents(updatedEvents);
//       } else {
//         const errorData = await res.json();
//         alert(`刪除失敗：${errorData.error || "未知錯誤"}`);
//       }
//     } catch (err) {
//       alert("刪除失敗：" + err.message);
//     }
//   };

//   if (loading) return <div className="text-gray-300">載入中...</div>;
//   if (error) return <div className="text-red-500">{error}</div>;

//   return (
//     <div className="p-6 min-h-screen relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
//       <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow">
//         📅 Upcoming Events
//       </h2>

//       <ul className="space-y-4 max-w-xl mx-auto">
//         {events.map((event) => {
//           const displayName = event.name || "（未命名活動）";
//           const displayDate = event.start_time?.slice(0, 10) || "未知日期";

//           return (
//             <li
//               key={event.id}
//               onClick={() => handleClick(event.id)}
//               className="cursor-pointer bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow border border-white/10 flex justify-between items-center hover:bg-white/20 transition"
//             >
//               <span className="font-medium text-white">{displayName}</span>
//               <span className="text-sm text-white/70">{displayDate}</span>
//             </li>
//           );
//         })}
//       </ul>

//       {/* 固定右下角的刪除按鈕 */}
//       <button
//         onClick={() => setShowModalDelete(true)}
//         className="fixed bottom-6 right-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-lg"
//       >
//         Delete Event
//       </button>

//       {/* Delete Modal */}
//       {showModalDelete && (
//         <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
//           <div className="bg-white text-black p-6 rounded-xl w-96 shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
//             <h2 className="text-xl font-bold">Delete Event</h2>

//             <select
//               className="w-full p-2 border rounded"
//               value={selectedEventId}
//               onChange={(e) => setSelectedEventId(e.target.value)}
//             >
//               <option value="" disabled>請選擇要刪除的活動</option>
//               {events.map((event) => (
//                 <option key={event.id} value={event.id}>
//                   {event.name || `未命名 (${event.id})`}
//                 </option>
//               ))}
//             </select>

//             <div className="flex justify-end gap-2">
//               <button
//                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                 onClick={() => {
//                   setShowModalDelete(false);
//                   setSelectedEventId("");
//                 }}
//               >
//                 Cancel
//               </button>

//               <button
//                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//                 onClick={handleConfirmDelete}
//               >
//                 Confirm Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpcomingEvents;