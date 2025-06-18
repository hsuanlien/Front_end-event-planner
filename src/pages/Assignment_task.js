import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import db from '../db.json';  //  我複製了db.json到src底下，因為我不會fetch url，然後原本的db.json在public取不到資料

// const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const TaskAssignmentPage = () => {
  const navigate = useNavigate();
  // Task3 TODO 
  // 用來存放後端回傳的任務分工資料
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    role: '',
    description: '',
    count: '',
    start_time: '',
    end_time: ''
  });

  useEffect(() => {
  fetch("http://localhost:3001/task_summary_by_role")
    .then(res => {
      if (!res.ok) {
        throw new Error("無法取得任務資料");
      }
      return res.json();
    })
    .then(data => setTasks(data))
    .catch(err => {
      console.error(err);
      setError("fail to fetch from server");
    });
  }, []);

  const handleAddTask = () => {
    // Task3
    // TODO: 開啟彈窗，可擴充任務欄位
    // alert("功能擴充中：新增任務");
    setShowModal(true);
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <div className="flex">
        {/* Main Task Area */}
        <main className="flex-1 flex flex-col p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6 drop-shadow-md">
            📌 Task Assignment
          </h1>

          {/* Task3 TODO: 點此按鈕可新增任務 */}
          <button
            onClick={handleAddTask}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition"
          >
            ＋ 新增任務
          </button>
          {/* Task3 任務列表區塊 */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-inner space-y-4">
            {/* Task3  TODO: 根據後端回傳資料顯示任務資訊  */}
            {tasks.length > 0 ? (
              tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-white text-black shadow-md hover:bg-cyan-100 transition"
                >
                  <h2 className="font-semibold text-lg">{task.role}</h2>
                  <p className="text-sm text-gray-700 mt-1">
                    Work description: {task.description}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    People needed: {task.count}
                  </p>
                  <p className="text-sm text-gray-700">
                    Start at: {task.start_time}
                  </p>
                  <p className="text-sm text-gray-700">
                    End at: {task.end_time}
                  </p>
                </div>
              ))
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <p>loading...</p>
            )}
          </div>
        </main>
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white text-black p-6 rounded-xl w-96 shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold">新增任務</h2>

              <input
                type="text"
                placeholder="任務角色"
                className="w-full p-2 border rounded"
                value={newTask.role}
                onChange={(e) => setNewTask({ ...newTask, role: e.target.value })}
              />
              <input
                type="text"
                placeholder="任務內容描述"
                className="w-full p-2 border rounded"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <input
                type="number"
                placeholder="所需人數"
                className="w-full p-2 border rounded"
                value={newTask.count}
                onChange={(e) => setNewTask({ ...newTask, count: parseInt(e.target.value) })}
              />
              <input
                type="datetime-local"
                placeholder="開始時間"
                className="w-full p-2 border rounded"
                value={newTask.start_time}
                onChange={(e) => setNewTask({ ...newTask, start_time: e.target.value })}
              />
              <input
                type="datetime-local"
                placeholder="結束時間"
                className="w-full p-2 border rounded"
                value={newTask.end_time}
                onChange={(e) => setNewTask({ ...newTask, end_time: e.target.value })}
              />

              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setShowModal(false)}
                >
                  取消
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  
                  onClick={async () => {
                    const { role, description, count, start_time, end_time } = newTask;

                    if (
                      !role.trim() ||
                      !description.trim() ||
                      !count ||
                      !start_time ||
                      !end_time
                    ) {
                      alert("請填寫所有欄位");
                      return;
                    }

                    try {
                      const response = await fetch("http://localhost:3001/task_summary_by_role", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        body: JSON.stringify(newTask)
                      });

                      if (!response.ok) {
                        throw new Error("無法新增任務");
                      }

                      const createdTask = await response.json();

                      setTasks([...tasks, createdTask]);  // 更新畫面
                      setNewTask({
                        role: '',
                        description: '',
                        count: '',
                        start_time: '',
                        end_time: ''
                      });
                      setShowModal(false);
                    } catch (error) {
                      console.error("新增任務失敗：", error);
                      alert("新增任務失敗，請稍後再試");
                    }
                  }}

                  // onClick={() => { 原本的！
                  //   const { role, description, count, start_time, end_time } = newTask;

                  //   if (
                  //     !role.trim() ||
                  //     !description.trim() ||
                  //     !count ||
                  //     !start_time ||
                  //     !end_time
                  //   ) {
                  //     alert("請填寫所有欄位");
                  //     return;
                  //   }

                  //   setTasks([...tasks, newTask]);
                  //   setNewTask({
                  //     role: '',
                  //     description: '',
                  //     count: '',
                  //     start_time: '',
                  //     end_time: ''
                  //   });
                  //   setShowModal(false);
                  // }}

                >
                  確認新增
                </button>
              </div>
            </div>
          </div>
        )}
      </div>


      
    </div>

  );

  
};

export default TaskAssignmentPage;
