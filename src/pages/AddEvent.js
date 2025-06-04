import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slider";

const AddEvent = () => {
  const [goal, setGoal] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState(50);
  const [audience, setAudience] = useState("");
  const [atmosphere, setAtmosphere] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      goal,
      type,
      date,
      budget,
      audience,
      atmosphere,
    };
    console.log("新增活動：", eventData);
    navigate("/upcoming");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white p-6">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/20">
        <h2 className="text-3xl font-bold mb-8 text-cyan-300 drop-shadow">
          Add New Event
        </h2>
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
            <option value="音樂會">音樂會</option>
            <option value="野餐">野餐</option>
            <option value="運動會">運動會</option>
          </select>

          {/* Budget */}
          <div className="w-full max-w-md">
            <label className="block mb-2 text-sm text-cyan-200">Budget: ${budget}</label>
            <Slider
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
            />
          </div>



          {/* Audience */}
          <select
            className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            required
          >
            <option value="" disabled>Audience</option>
            <option value="教授">教授</option>
            <option value="學生">學生</option>
            <option value="家長">家長</option>
          </select>

          {/* Event atmosphere */}
          <select
            className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={atmosphere}
            onChange={(e) => setAtmosphere(e.target.value)}
            required
          >
            <option value="" disabled>Event atmosphere</option>
            <option value="lighting">lighting</option>
            <option value="music">music</option>
            <option value="decor">decor</option>
          </select>

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




// src/pages/AddEvent.js
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const AddEvent = () => {
//   const [title, setTitle] = useState("");
//   const [date, setDate] = useState("");
//   const [location, setLocation] = useState("");
//   const [description, setDescription] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert(`新增活動：${title}`);
//     // TODO: 在這裡加上儲存活動的邏輯      
//     navigate("/upcoming"); // 提交後導向 upcoming 頁面
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white p-6">
//       <div className="w-full max-w-xl bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/20">
//         <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow">
//           ➕ Add New Event
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//             type="text"
//             placeholder="Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//           <input
//             className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             required
//           />
//           <input
//             className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//             type="text"
//             placeholder="Location"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           />
//           <textarea
//             className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//             placeholder="Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             rows="4"
//           />
//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddEvent;
