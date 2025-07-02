import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const TaskAssignmentPage = () => {
  //const { id } = useParams();
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [editRole, setEditRole] = useState("");
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [deleteRole, setDeleteRole] = useState("");
  const [eventDate, setEventDate] = useState("");
  const API_BASE = "https://genai-backend-2gji.onrender.com/api";

  const [newTask, setNewTask] = useState({
    role: "",
    description: "",
    count: "",
    start_time: "",
    end_time: ""
  });

  const [editTask, setEdittedTask] = useState({
    role: "",
    description: "",
    count: "",
    start_time: "",
    end_time: ""
  });

  const formatDateTimeToUTC = (localDateTime) => {
    const date = new Date(localDateTime);
    return date.toISOString();
  };

  const eventId = localStorage.getItem("event_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
      if (!eventId || !token) return;

      const fetchGeneratedTasks = async () => {
        try {
          const response = await fetch(`https://genai-backend-2gji.onrender.com/ai/generate-tasks/${eventId}/`, {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch task data");
          }

          const data = await response.json();
          console.log("Raw response data:", data);
          console.log("task_summary_by_role:", data.task_summary_by_role);
          setTasks(data.task_summary_by_role || []);
        } catch (err) {
          console.error("Fetch failed:", err);
          setError("fail to fetch from server");
        }
      };

      fetchGeneratedTasks();
    }, [eventId, token]);

  // useEffect(() => {
  // if (!eventId || !token) return;

  // fetch(`https://genai-backend-2gji.onrender.com/ai/generate-task-assignments/${eventId}/`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //      Authorization: `Token ${token}`,
  //   },
  //  // body: JSON.stringify({ event_id: eventId }),
  // })
  //   .then((res) => {
  //     if (!res.ok) {
  //       throw new Error("Failed to fetch task data");
  //     }
  //     return res.json();
  //   })
  //   .then((data) => {
  //     console.log("Raw response data:", data);
  //     console.log("task_summary_by_role:", data.task_summary_by_role);
  //     setTasks(data.task_summary_by_role || []);

  //     // setTasks(data.task_summary_by_role);  // 注意：是 data.task_summary_by_role
  //     // console.log("Fetched generated tasks:", data.task_summary_by_role);
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     setError("fail to fetch from server");
  //   });
  // }, [eventId, token]);

  // useEffect(() => {
  //   fetch(`https://genai-backend-2gji.onrender.com/ai/generate-task-assignments/${id}/`, {
  //     headers: {
  //       Authorization: `Token ${token}`
  //     }
  //   })
  //     .then(res => {
  //       if (!res.ok) {
  //         throw new Error("Failed to fetch task data");
  //       }
  //       return res.json();
  //     })
  //     .then(data => {
  //      // console.log("Fetched assignments:", data);
  //       setTasks(data);
  //       console.log(data);
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       setError("fail to fetch from server");
  //     });
  // }, [eventId, token]);

  useEffect(() => {
  fetch(`${API_BASE}/events/${eventId}/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch event");
      }
      return res.json();
    })
    .then((data) => {
      const startDate = data.start_time?.split("T")[0];
      setEventDate(startDate);
    })
    .catch((err) => {
      console.error("Failed to fetch event:", err);
    });
  }, [eventId, token]);

  const handleAddTask = () => {
    setNewTask({
      role: "",
      description: "",
      count: "",
      start_time: `${eventDate}T00:00`,
      end_time: `${eventDate}T23:59`
    });
    setShowModalAdd(true);
    setShowModalEdit(false);
    setShowModalDelete(false);
  };

  const handleEditTask = () => {
    setEdittedTask((prev) => ({
      ...prev,
      start_time: `${eventDate}T00:00`,
      end_time: `${eventDate}T23:59`
    }));
    setShowModalAdd(false);
    setShowModalEdit(true);
    setShowModalDelete(false);
  };

  const toLocalDateTimeString = (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16); //  "YYYY-MM-DDTHH:mm"
  };

  const handleDeleteTask = () => {
    setShowModalAdd(false);
    setShowModalEdit(false);
    setShowModalDelete(true);
  };

  const handleConfirmDelete = async () => {
    const taskToDelete = tasks.find((task) => task.role === deleteRole);
    if (!taskToDelete) {
      alert("Task not found");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/assignments/${taskToDelete.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      setTasks(tasks.filter(task => task.id !== taskToDelete.id));
      setDeleteRole("");
      setShowModalDelete(false);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete failed. Please try again later.");
    }
  };

  const handleConfirmAdd = async () => {
    try {
      const response = await fetch(`${API_BASE}/events/${eventId}/assignments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`
        },
        body: JSON.stringify({
          ...newTask,
          start_time: formatDateTimeToUTC(newTask.start_time),
          end_time: formatDateTimeToUTC(newTask.end_time)
        })
      });
      if (!response.ok) {
        throw new Error("Failed to add task");
      }
      const data = await response.json();
      setTasks([...tasks, data]);
      setNewTask({ role: "", description: "", count: "", start_time: `${eventDate}T09:00`, end_time: `${eventDate}T23:00` });
      setShowModalAdd(false);
    } catch (err) {
      console.error("Add failed:", err);
      alert("Add failed. Please try again later.");
    }
  };

  const handleConfirmEdit = async () => {
    const taskToEdit = tasks.find((task) => task.role === editRole);
    if (!taskToEdit) {
      alert("Task not found");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/assignments/${taskToEdit.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`
        },
        body: JSON.stringify({
          ...editTask,
          start_time: formatDateTimeToUTC(editTask.start_time),
          end_time: formatDateTimeToUTC(editTask.end_time)
        })
      });
      if (!response.ok) {
        throw new Error("Failed to edit task");
      }
      const updatedTask = await response.json();
      setTasks(tasks.map(task => task.id === taskToEdit.id ? updatedTask : task));
      setEdittedTask({ role: "", description: "", count: "", start_time: "", end_time: "" });
      setEditRole("");
      setShowModalEdit(false);
    } catch (err) {
      console.error("Edit failed:", err);
      alert("Edit failed. Please try again later.");
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-6 drop-shadow-md">
        📌 Task Assignment
      </h1>
      <main className="flex flex-row h-screen w-full px-8 gap-4">
        <div className="w-1/6 items-start max-h-screen overflow-y-hidden">
          <button
            onClick={() => navigate(-1)}
            className="h-20 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow border border-gray-400"
          >
            ← Back
          </button>
        </div>
        <div className="flex-1 flex-column max-h-screen overflow-y-auto bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-inner space-y-4">
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
        <div className="w-1/6 flex-col gap-4 items-start max-h-screen overflow-y-hidden">
        
          <div>
            <button
              onClick={handleAddTask}
              className="h-20 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
            >
              Add
            </button>


            <button
              onClick={handleEditTask}
              className="h-20 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
            >
              Edit
            </button>
            <button
              onClick={handleDeleteTask}
              className="h-20 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
            >
              Delete
            </button>
          </div>
        </div>
      </main>

    {/* Add function */}
    {showModalAdd && (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white text-black p-6 rounded-xl w-96 shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold">新增任務</h2>
          <input
            type="text"
            placeholder="角色"
            className="w-full p-2 border rounded"
            value={newTask.role}
            onChange={(e) => setNewTask({ ...newTask, role: e.target.value })}
          />
          <input
            type="text"
            placeholder="描述"
            className="w-full p-2 border rounded"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="人數"
            className="w-full p-2 border rounded"
            value={newTask.count}
            onChange={(e) => setNewTask({ ...newTask, count: e.target.value })}
          />
          <input
            type="datetime-local"
            className="w-full p-2 border rounded"
            value={newTask.start_time}
            onChange={(e) => setNewTask({ ...newTask, start_time: e.target.value })}
          />
          <input
            type="datetime-local"
            className="w-full p-2 border rounded"
            value={newTask.end_time}
            onChange={(e) => setNewTask({ ...newTask, end_time: e.target.value })}
          />
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setShowModalAdd(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
              onClick={handleConfirmAdd}
            >
              確認新增
            </button>
          </div>
        </div>
      </div>
    )}
{/* Edit 功能 */}
{showModalEdit && (
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
    <div className="bg-white text-black p-6 rounded-xl w-96 shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold">編輯任務</h2>

      <select
        className="w-full p-2 border rounded"
        value={editRole}
        onChange={(e) => {
          const selectedRole = e.target.value;
          setEditRole(selectedRole);
          const selectedTask = tasks.find(t => t.role === selectedRole);
          if (selectedTask) {
            setEdittedTask({
              role: selectedTask.role,
              description: selectedTask.description,
              count: selectedTask.count,
              start_time: toLocalDateTimeString(selectedTask.start_time),
              end_time: toLocalDateTimeString(selectedTask.end_time)
            });
          }
        }}
      >
        <option value="" disabled>選擇任務角色</option>
        {tasks.map((task, idx) => (
          <option key={idx} value={task.role}>{task.role}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="描述"
        className="w-full p-2 border rounded"
        value={editTask.description}
        onChange={(e) => setEdittedTask({ ...editTask, description: e.target.value })}
      />
      <input
        type="number"
        placeholder="人數"
        className="w-full p-2 border rounded"
        value={editTask.count}
        onChange={(e) => setEdittedTask({ ...editTask, count: e.target.value })}
      />
      <input
        type="datetime-local"
        className="w-full p-2 border rounded"
        value={editTask.start_time}
        onChange={(e) => setEdittedTask({ ...editTask, start_time: e.target.value })}
      />
      <input
        type="datetime-local"
        className="w-full p-2 border rounded"
        value={editTask.end_time}
        onChange={(e) => setEdittedTask({ ...editTask, end_time: e.target.value })}
      />
      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => setShowModalEdit(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
          onClick={handleConfirmEdit}
        >
          確認編輯
        </button>
      </div>
    </div>
  </div>
)}

{/* Delete功能 */}
      {showModalDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-xl w-96 shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold">Delete Task</h2>
            <select
              className="w-full p-2 border rounded"
              required
              value={deleteRole}
              onChange={(e) => setDeleteRole(e.target.value)}
            >
              <option value="" disabled>Task role</option>
              {tasks.map((task, idx) => (
                <option key={idx} value={task.role}>{task.role}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowModalDelete(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={handleConfirmDelete}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TaskAssignmentPage;