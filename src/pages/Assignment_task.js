/*import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 測試用，直接寫死 eventId 為 9
const eventId = 9;

const TaskAssignmentPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    role: "", description: "", count: "", start_time: "", end_time: ""
  });
  const [editTask, setEditTask] = useState({ ...newTask });

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    // http://127.0.0.1:8000/ai/generate-task-assignments/
    fetch(`http://127.0.0.1:8000/ai/generate-task-assignments/`, {
      headers: { Authorization: `Token ${token}` }
    })
    // fetch(`http://127.0.0.1:8000/api/events/${eventId}/assignments/`, {
    //   headers: { Authorization: `Token ${token}` }
    // })
      .then(res => res.ok ? res.json() : Promise.reject("Fetch failed"))
      .then(setTasks)
      .catch(err => { console.error(err); setError("無法取得任務"); });
  }, [token]);

  const toISO = dt => new Date(dt).toISOString();

  const handleAddSubmit = async () => {
    try {
      const body = {
        ...newTask,
        count: Number(newTask.count),
        start_time: toISO(newTask.start_time),
        end_time: toISO(newTask.end_time),
      };
      const res = await fetch(`http://127.0.0.1:8000/api/events/${eventId}/assignments/`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) setTasks(prev => [...prev, data]);
      else throw data;
      setShowModalAdd(false);
    } catch (err) {
      console.error(err); alert("新增失敗");
    }
  };

  const handleEditSubmit = async () => {
    try {
      const body = {
        role: editTask.role || selectedTask.role,
        description: editTask.description || selectedTask.description,
        count: Number(editTask.count || selectedTask.count),
        start_time: toISO(editTask.start_time || selectedTask.start_time),
        end_time: toISO(editTask.end_time || selectedTask.end_time),
      };
      const res = await fetch(`http://127.0.0.1:8000/api/assignments/${selectedTask.id}/`, {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) setTasks(prev => prev.map(t => t.id === data.id ? data : t));
      else throw data;
      setShowModalEdit(false);
    } catch (err) {
      console.error(err); alert("編輯失敗");
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/assignments/${selectedTask.id}/`, {
        method: "DELETE", headers: { Authorization: `Token ${token}` },
      });
      if (res.status === 204) setTasks(prev => prev.filter(t => t.id !== selectedTask.id));
      else throw "";
      setShowModalDelete(false);
    } catch (err) {
      console.error(err); alert("刪除失敗");
    }
  };

  const renderTaskCard = task => (
    <div key={task.id}
      className="p-4 rounded-lg bg-white text-black shadow-md hover:bg-cyan-100 cursor-pointer"
      onClick={() => { setSelectedTask(task); setEditTask({}); }}
    >
      <h2 className="font-semibold text-lg">{task.role}</h2>
      <p className="text-sm">Desc: {task.description}</p>
      <p className="text-sm">Count: {task.count}</p>
      <p className="text-sm">From: {task.start_time}</p>
      <p className="text-sm">To: {task.end_time}</p>
    </div>
  );

  if (!token) return null;

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">📌 Task Assignment</h1>
      <button onClick={() => navigate(-1)}
        className="fixed bottom-4 left-4 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg">← Back</button>

      <div className="flex gap-4">
        <div className="flex-1 overflow-auto max-h-[70vh]">
          {tasks.length ? tasks.map(renderTaskCard) : error ? <p className="text-red-400">{error}</p> : <p>Loading…</p>}
        </div>

        <div className="flex flex-col gap-4 w-1/6">
          <button onClick={() => setShowModalAdd(true)}
            className="bg-cyan-500 hover:bg-cyan-600 py-2 rounded-lg">Add</button>
          <button onClick={() => {
            if (!selectedTask) return alert("請先點選任務");
            setShowModalEdit(true);
          }} className="bg-cyan-500 hover:bg-cyan-600 py-2 rounded-lg">Edit</button>
          <button onClick={() => {
            if (!selectedTask) return alert("請先點選任務");
            setShowModalDelete(true);
          }} className="bg-cyan-500 hover:bg-cyan-600 py-2 rounded-lg">Delete</button>
        </div>
      </div>

      {showModalAdd && (
        <Modal title="新增任務" fields={newTask} setFields={setNewTask}
          onCancel={() => setShowModalAdd(false)} onSubmit={handleAddSubmit} />
      )}
      {showModalEdit && selectedTask && (
        <Modal title="編輯任務" fields={editTask} setFields={setEditTask}
          onCancel={() => setShowModalEdit(false)} onSubmit={handleEditSubmit} />
      )}
      {showModalDelete && selectedTask && (
        <ConfirmDeleteModal title="刪除任務"
          onCancel={() => setShowModalDelete(false)} onConfirm={handleDeleteSubmit} />
      )}
    </div>
  );
};

const Modal = ({ title, fields, setFields, onCancel, onSubmit }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg w-96 text-black">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <input className="w-full mb-2 p-2 border" placeholder="Role"
        value={fields.role} onChange={e => setFields(f => ({ ...f, role: e.target.value }))} />
      <input className="w-full mb-2 p-2 border" placeholder="Description"
        value={fields.description} onChange={e => setFields(f => ({ ...f, description: e.target.value }))} />
      <input type="number" className="w-full mb-2 p-2 border" placeholder="Count"
        value={fields.count} onChange={e => setFields(f => ({ ...f, count: e.target.value }))} />
      <input type="datetime-local" className="w-full mb-2 p-2 border"
        value={fields.start_time} onChange={e => setFields(f => ({ ...f, start_time: e.target.value }))} />
      <input type="datetime-local" className="w-full mb-2 p-2 border"
        value={fields.end_time} onChange={e => setFields(f => ({ ...f, end_time: e.target.value }))} />
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">取消</button>
        <button onClick={onSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">確定</button>
      </div>
    </div>
  </div>
);

const ConfirmDeleteModal = ({ title, onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg text-black">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <p className="mb-4">確定要刪除此任務嗎？</p>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">取消</button>
        <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">刪除</button>
      </div>
    </div>
  </div>
);

export default TaskAssignmentPage;
 */


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TaskAssignmentPage = () => {
  const navigate = useNavigate();
 
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [editRole, setEditRole] = useState(false);
  const [deleteRole, setDeleteRole] = useState(false);
  const [newTask, setNewTask] = useState({
    role: '',
    description: '',
    count: '',
    start_time: '',
    end_time: ''
  });
  const [editTask, setEdittedTask] = useState({
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
          throw new Error("Failed to fetch task data");
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
    // 開啟彈窗，可擴充任務欄位
    // alert("功能擴充中：新增任務");
    setShowModalAdd(true);
    setShowModalEdit(false);
    setShowModalDelete(false);
  };
  const handleEditTask = () => {
    setShowModalAdd(false);
    setShowModalEdit(true);
    setShowModalDelete(false);
  };
  const handleDeleteTask = () => {
    setShowModalAdd(false);
    setShowModalEdit(false);
    setShowModalDelete(true);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      {/* Main Task Area */}
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
        {/* 任務列表區塊 */}
        <div className="flex-1 flex-column max-h-screen overflow-y-auto bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-inner space-y-4">
          {/* 根據後端回傳資料顯示任務資訊  */}
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
            {/* 點此按鈕可新增任務 */}
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
          <div>
            {
              showModalAdd && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white text-black p-6 rounded-xl w-96 shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
                    <h2 className="text-xl font-bold">Add New Task</h2>

                    <input
                      type="text"
                      placeholder="Task Role"
                      className="w-full p-2 border rounded"
                      value={newTask.role}
                      onChange={(e) => setNewTask({ ...newTask, role: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Task Description"
                      className="w-full p-2 border rounded"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Number of People"
                      className="w-full p-2 border rounded"
                      value={newTask.count}
                      onChange={(e) => setNewTask({ ...newTask, count: parseInt(e.target.value) })}
                    />
                    <input
                      type="datetime-local"
                      placeholder="Event Start Time"
                      className="w-full p-2 border rounded"
                      value={newTask.start_time}
                      onChange={(e) => setNewTask({ ...newTask, start_time: e.target.value })}
                    />
                    <input
                      type="datetime-local"
                      placeholder="Event End Time"
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
                            alert("Please fill out all fields");
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
                              throw new Error("Failed to add task");
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
                            setShowModalAdd(false);
                          } catch (error) {
                            console.error("Add failed: ", error);
                            alert("Add failed. Please try again later.");
                          }
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )
            }
            {
              showModalEdit && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white text-black p-6 rounded-xl w-96 shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
                    <h2 className="text-xl font-bold">Edit Task</h2>
                    <select
                      className="w-full p-2 border rounded"
                      required
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                    >
                      <option value="" disabled>Task role</option>
                      {tasks.length > 0 ? (
                        tasks.map((task, idx) => (
                          <option key={idx} value={task.role}>{task.role}</option>
                        ))
                      ) : error ? (
                        <p className="text-red-500">{error}</p>
                      ) : (
                        <p>loading...</p>
                      )}
                    </select>
                    <input
                      type="text"
                      placeholder="Edit Task Role"
                      className="w-full p-2 border rounded"
                      value={editTask.role}
                      onChange={(e) => setEdittedTask({ ...editTask, role: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Edit Task Description"
                      className="w-full p-2 border rounded"
                      value={editTask.description}
                      onChange={(e) => setEdittedTask({ ...editTask, description: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Edit Number of People"
                      className="w-full p-2 border rounded"
                      value={editTask.count}
                      onChange={(e) => setEdittedTask({ ...editTask, count: e.target.value })}
                    />
                    <input
                      type="datetime-local"
                      placeholder="Edit Start Time"
                      className="w-full p-2 border rounded"
                      value={editTask.start_time}
                      onChange={(e) => setEdittedTask({ ...editTask, start_time: e.target.value })}
                    />
                    <input
                      type="datetime-local"
                      placeholder="Edit End Time"
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
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={async () => {
                          const taskToEdit = tasks.find((task) => task.role === editRole);
                          if (!taskToEdit) {
                            alert("Could not find the selected task!");
                            return;
                          }

                          const updatedTask = {
                            ...taskToEdit,
                            ...Object.fromEntries(Object.entries(editTask).filter(([_, v]) => v !== "" && v !== null))
                          };

                          try {
                            const response = await fetch(`http://localhost:3001/task_summary_by_role/${taskToEdit.id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(updatedTask)
                            });

                            if (!response.ok) {
                              const errorMessage = await response.text();
                              throw new Error("Server Error: " + errorMessage);
                            }

                            const result = await response.json();
                            const newTasks = tasks.map((task) => (task.role === editRole ? result : task));
                            setTasks(newTasks);
                            setShowModalEdit(false);
                            setEditRole('');
                            setEdittedTask({
                              role: '',
                              description: '',
                              count: '',
                              start_time: '',
                              end_time: ''
                            });
                          } catch (err) {
                            console.error("Update failed: ", err);
                            alert("Update failed. Please try again later.");
                          }
                        }}

                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              )
            }
            {
              showModalDelete && (
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
                      {tasks.length > 0 ? (
                        tasks.map((task, idx) => (
                          <option key={idx} value={task.role}>{task.role}</option>
                        ))
                      ) : error ? (
                        <p className="text-red-500">{error}</p>
                      ) : (
                        <p>loading...</p>
                      )}
                    </select>
                    <div className="flex justify-end gap-2">
                      <button
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"

                        onClick={async () => {
                          const taskToDelete = tasks.find((task) => task.role === deleteRole);
                          if (!taskToDelete) {
                            alert("Could not find the selected task!");
                            return;
                          }

                          try {
                            const response = await fetch(`http://localhost:3001/task_summary_by_role/${taskToDelete.id}`, {
                              method: "DELETE"
                            });

                            if (!response.ok) {
                              throw new Error("Failed to delete task");
                            }

                            // Update frontend state
                            setTasks(tasks.filter(task => task.id !== taskToDelete.id));
                            setDeleteRole('');
                            setShowModalDelete(false);
                          } catch (error) {
                            console.error("Delete failed: ", error);
                            alert("Delete failed. Please try again later.");
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </main >
    </div >

  );
};

export default TaskAssignmentPage;