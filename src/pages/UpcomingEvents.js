// src/pages/UpcomingEvents.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// const API_BASE = "http://127.0.0.1:8000/api"; // Django API base
const API_BASE = "http://localhost:8000"; // json-server base

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
    //navigate(`/event/${id}`); // 跳轉到該活動詳細頁
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




//------------------------aloha---------------------

// // src/pages/UpcomingEvents.js
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// // import { API } from "../config";
// const API_BASE = "http://localhost:3001";

// export const API = {
//   BASE: API_BASE,
//   EVENTS: `${API_BASE}/events`,
//   USERS: `${API_BASE}/users`,
//   // 你可以依需求加更多
// };

// const UpcomingEvents = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchEvents = async () => {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await fetch(API.EVENTS, {
//         headers: { Authorization: `Token ${token}` },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setEvents(data);
//       } else {
//         setError("無法載入活動");
//       }
//       setLoading(false);
//     };
//     fetchEvents();
//   }, []);

//   const handleClick = (id) => {
//     navigate(`/event/${id}`);
//   };

//   if (loading) return <div className="text-gray-300">載入中...</div>;
//   if (error) return <div className="text-red-500">{error}</div>;

//   return (
//     <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
//       <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow">
//         📅 Upcoming Events
//       </h2>
//       <ul className="space-y-4 max-w-xl mx-auto">
//         {events.map((event) => {
//           // 取最新版本
//           let latest = event.versions
//             ? event.versions[event.versions.length - 1]
//             : event;
//           return (
//             <li
//               key={event.id}
//               onClick={() => handleClick(event.id)}
//               className="cursor-pointer bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow border border-white/10 flex justify-between items-center hover:bg-white/20 transition"
//             >
//               <span className="font-medium text-white">{latest.name}</span>
//               <span className="text-sm text-white/70">
//                 {latest.date?.slice(0, 10)}
//               </span>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };
// export default UpcomingEvents;




///--------------old----------------------------------=
// // src/pages/UpcomingEvents.js
// import React from "react";
// import { useNavigate } from "react-router-dom";

// const mockEvents = [
//   { id: 1, title: "Team Meeting", date: "2025-06-01" },
//   { id: 2, title: "Project Demo", date: "2025-06-05" },
// ];

// const UpcomingEvents = () => {
//   const navigate = useNavigate();

//   const handleClick = (id) => {
//     navigate(`/event/${id}/choose-event-time`);
//     // navigate(`/event/${id}/${version}/poster-template`);
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
//       <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow">
//         📅 Upcoming Events
//       </h2>
//       <ul className="space-y-4 max-w-xl mx-auto">
//         {mockEvents.map((event) => (
//           // 然後在 map 中每個 event 加上 onClick
//           <li
//             key={event.id}
//             onClick={() => handleClick(event.id)}
//             className="cursor-pointer bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow border border-white/10 flex justify-between items-center hover:bg-white/20 transition"
//           >
//             <span className="font-medium text-white">{event.title}</span>
//             <span className="text-sm text-white/70">{event.date}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };
// export default UpcomingEvents;