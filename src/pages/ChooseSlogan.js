import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ChooseSlogan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const eventName = location.state?.eventName || "";
  const [slogans, setSlogans] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/events")
      .then(res => res.json())
      .then(data => {
        const sloganList = data[0]?.slogan || [];
        setSlogans(sloganList);
        setSelected(sloganList[0] || "");
      });
  }, []);

  const handleConfirm = () => {
    navigate("/event-description", {
      state: { eventName, slogan: selected }
    });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
      <main className="flex-1 flex flex-col p-8">
        <h1 className="text-3xl font-bold mb-6 drop-shadow-md">
          ✨ Choose Slogan
        </h1>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-inner space-y-4 max-w-xl">
          {slogans.map((slogan, idx) => (
            <label
              key={idx}
              className={`block p-4 rounded-lg cursor-pointer border ${
                selected === slogan
                  ? "bg-cyan-500 text-white border-cyan-400"
                  : "bg-white text-black border-white/50 hover:bg-cyan-100 transition"
              }`}
            >
              <input
                type="radio"
                name="slogan"
                value={slogan}
                checked={selected === slogan}
                onChange={() => setSelected(slogan)}
                className="mr-2"
              />
              {slogan}
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

export default ChooseSlogan;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const ChooseSlogan = () => {
//   const navigate = useNavigate();
//   const [selected, setSelected] = useState("");
//  // Task2  TODO:
//  // Similar to how you implement in ChooseName.js

//   const slogans = [
//     "Unite & Inspire",
//     "Connect. Share. Grow.",
//     "Vibe Together",
//     "Ignite the Future",
//     "Celebrate Unity"
//   ];

//   return (
//     <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
//       <main className="flex-1 flex flex-col p-8">
//         <h1 className="text-3xl font-bold mb-6 drop-shadow-md">
//           ✨ Choose Slogan
//         </h1>

//         <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-inner space-y-4 max-w-xl">
//           {slogans.map((slogan, idx) => (
//             <label
//               key={idx}
//               className={`block p-4 rounded-lg cursor-pointer border ${
//                 selected === slogan
//                   ? "bg-cyan-500 text-white border-cyan-400"
//                   : "bg-white text-black border-white/50 hover:bg-cyan-100 transition"
//               }`}
//             >
//               <input
//                 type="radio"
//                 name="slogan"
//                 value={slogan}
//                 onChange={() => setSelected(slogan)}
//                 className="mr-2"
//               />
//               {slogan}
//             </label>
//           ))}
//         </div>

//         <div className="flex justify-end pt-6">
//           <button
//             onClick={() => navigate("/event-description")}
//             className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
//           >
//             確認
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ChooseSlogan;
