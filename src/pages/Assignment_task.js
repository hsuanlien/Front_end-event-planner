import React from "react";
import { useNavigate } from "react-router-dom";

const TaskAssignmentPage = () => {
  const navigate = useNavigate();
  // Task3 TODO 
  // 用來存放後端回傳的任務分工資料
  // const [tasks, setTasks] = useState([]); 
  //const [error, setError] = useState(null);

/*
useEffect(() => {
    // TODO: 發送 POST 請求至後端 API，取得任務分工
    // Body 內容從 event 資訊取得
    const fetchTaskAssignments = async () => {
      try {
        const response = await fetch(url, {
          method: ..........,
          headers: {
            "Content-Type": "application/json",
            "Authorization": ..............."
          },
          body: JSON.stringify({
            event: {
              ...........
            },
            task_assignments: {
              .............
            }
          })
        });

        const data = await response.json();

        if (response.ok) {
          // 成功接收 task summary
          setTasks(data.task_summary_by_role);
        } else {
          // 如果 API 回傳錯誤
          // setError(data.error);
        }
      } catch (err) {
        setError("連線錯誤或伺服器無回應");
      }
    };

    fetchTaskAssignments();
  }, []);
  
  const handleAddTask = () => {
    // Task3
    // TODO: 開啟彈窗或導向新增任務頁面，可擴充任務欄位
    alert("功能擴充中：新增任務");
  };

*/



  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">

      {/* Main Task Area */}
      <main className="flex-1 flex flex-col p-8">
        <h1 className="text-3xl font-bold mb-6 drop-shadow-md">
          📌 Task Assignment
        </h1>

        {/* Task3 TODO: 點此按鈕可新增任務 */}
          {/* <button
            onClick={handleAddTask}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition"
          >
            ＋ 新增任務
          </button> */}


        {/* Task3 任務列表區塊 */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-inner space-y-4 overflow-y-auto">
          {/* Task3  TODO: 根據後端回傳資料顯示任務資訊  */}
          {["Design landing page", "Write blog content", "Fix login bug"].map((task, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-white text-black shadow-md hover:bg-cyan-100 transition"
            >
              <h2 className="font-semibold text-lg">{task}</h2>
              <p className="text-sm text-gray-700 mt-1">
                Assigned to: John Doe
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TaskAssignmentPage;
