import React from "react";
import { useNavigate } from "react-router-dom";

const Event_Description = () => {
  const navigate = useNavigate();

  const description = `
    Welcome to Unity Fest! 🎉 
    This is a campus-wide celebration that brings students together 
    through music, games, and community spirit. 
    Get ready for an unforgettable experience!
  `;
    
 // Task2  TODO:
 // useEffect(() => {
    // 向後端請求 event description，根據選定的 name + slogan 組合
    // URL
    // Header: Authorization: Token xxx
    // Body: {
    //   "name": "選定的 event name",
    //   "slogan": "選定的 slogan"
    // }
    // 成功後用 setDescription 更新內容
  //}, []);
  const handleConfirm = () => {
    // Task2 
    // 將選定的 name、slogan、description 傳回後端 API 存檔
    // URL: 
    // Header: Authorization: Token xxx
    // Body: {
    //   "name": "...",
    //   "slogan": "...",
    //   "description": "..." (description會依照相對應的event name顯示)
    // }

    // TODO: 成功送出後，跳轉至 Home Page
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
            // Task2 
            // 改成：onClick={handleConfirm}
            onClick={() => navigate("/home")}
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
