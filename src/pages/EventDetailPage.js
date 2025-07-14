// src/pages/EventDetailPage.js 
import { fetchWithAuth } from "../utils/auth";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Drop-down menu options written directly on the front end
const EVENT_TYPE_OPTIONS = [
  { value: "Workshop_Training", label: "Workshop / Training" },
  { value: "Social_Networking", label: "Social / Networking" },
  { value: "Performance_Showcase", label: "Performance / Showcase" },
  { value: "Speech_Seminar", label: "Speech / Seminar" },
  { value: "Recreational_Entertainment", label: "Recreational / Entertainment" },
  { value: "Market_Exhibition", label: "Market / Exhibition" },
  { value: "Competition_Challenge", label: "Competition / Challenge" },
];
const AUDIENCE_OPTIONS = [
  { value: "Students_Young", label: "Students / Young Adults" },
  { value: "Professionals", label: "Professionals" },
  { value: "Families", label: "Families" },
  { value: "Local_Community", label: "Local Community" },
];

const API_BASE = "https://genai-backend-2gji.onrender.com/api";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const [taskCompleted, setTaskCompleted] = useState(false); // do Task assignment
  const [venueCompleted, setVenueCompleted] = useState(true); //  do Venue select

  const [versions, setVersions] = useState([]); 
  const [selectedVersion, setSelectedVersion] = useState(""); 


  const sidebarItems = [
    { label: "Task assignment", key: "Task assignment", requires: [] },
    { label: "Venue Selection", key: "場地", requires: [] },
    { label: "Registration Form", key: "報名表單", requires: ["場地", "Task assignment"] },
    { label: "Invitation letter", key: "邀請函", requires: ["場地", "Task assignment"] },
    { label: "Social media post", key: "文案", requires: ["場地", "Task assignment"] },
  ];

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const response = await fetchWithAuth(`https://genai-backend-2gji.onrender.com/api/events/${id}/versions/`, {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        });
        if (!response.ok) throw new Error("Failed to fetch versions");
        const data = await response.json();
        //console.log("fetched versions:", data);

        //Sort by version_number in ascending order
        const sortedData = [...data].sort((a, b) => a.version_number - b.version_number);


        setVersions(sortedData); // All versions complete data array [{id: 6, ...}, ...]
        if (sortedData.length > 0) {
          setSelectedVersion(`v${sortedData.length}`); // Select the last version by default（v1, v2, ...）
        } else { // The version is not displayed when you first enter
          setSelectedVersion(""); // Clear if no version
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchVersions();
  }, [id, token]);

  // Display the corresponding version data according to the selected v1/v2/v3
  useEffect(() => { // Listen for selectedVersion changes
    if (!selectedVersion) return;

    // selectedVersion is v1, v2, v3, you need to get the corresponding index
    const versionIndex = parseInt(selectedVersion.replace("v", ""), 10) - 1;

    //Make sure index is within range
    if (versions[versionIndex]) {
      const selectedData = versions[versionIndex].event_snapshot;
      setEventData(selectedData);
      setFormData(selectedData);
    }
  }, [selectedVersion, versions]);

  useEffect(() => {
    const taskStatus = localStorage.getItem(`taskCompleted_${id}`) === "true";
    const venueStatus = localStorage.getItem(`venueCompleted_${id}`) === "true";
    setTaskCompleted(taskStatus);
    setVenueCompleted(venueStatus);
  }, [id]);



  const handleFunctionClick = (itemKey) => {
    const pathBase = `/event/${id}/`;
    if (itemKey === "場地") {
      setVenueCompleted(true);// Simulation completed
      localStorage.setItem(`venueCompleted_${id}`, "true");
      console.log("setVenueCompleted : ", setVenueCompleted);
      navigate(`${pathBase}venue`);
    } else if (itemKey === "報名表單") {
      navigate(`${pathBase}check-registration`);
    } else if (itemKey === "邀請函") {
      navigate(`${pathBase}invitation`);
    } else if (itemKey === "文案") {
      navigate(`${pathBase}copywriting`);
    } else if (itemKey === "Task assignment") {
      setTaskCompleted(true);  // Simulation completed
      localStorage.setItem(`taskCompleted_${id}`, "true");
      console.log("taskCompleted : ", setTaskCompleted);
      navigate(`${pathBase}assignment-task`);
    }
  };

  useEffect(() => {
    const fetchEventVersion = async () => {
      try {
        const response = await fetchWithAuth(
           `https://genai-backend-2gji.onrender.com/api/events/${id}/`,
          {
            // headers: {
            //   Authorization: `Bearer ${token}`,
            // },
          }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        console.log(data);
        
        if (data.event_snapshot) {
          //In the future, event_snapshot will be used when there are multiple versions (such as /versions/<id>/)
          setEventData(data.event_snapshot);
          setFormData(data.event_snapshot);
        } else {
          //The first time you come in, you actually get the data from GET /api/events/<id>/
          setEventData(data);
          setFormData(data);
        }
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch event version:", err);
      }
    };

    fetchEventVersion();
  }, [id]);

  const isItemEnabled = (item) =>
    item.requires.every((dep) => {
      if (dep === "場地") return venueCompleted;
      if (dep === "Task assignment") return taskCompleted;
      return true;
    });
    
  const handleChange = (e) => { // Form change field update
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave_Change = async () => {// Change fields to save patch
    setIsEditing(false);
    try {
      const response = await fetchWithAuth(
        `https://genai-backend-2gji.onrender.com/api/events/${id}/update/`, 
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`PATCH failed: ${response.status} ${JSON.stringify(errorData)}`);
      }

      const updatedData = await response.json();
      console.log("PATCH 成功，回傳資料:", updatedData);

        setEventData(updatedData);
      } catch (error) {
        console.error("handleSave_Change error:", error);
        //alert("Failed to save changes.");
      }
  }; 

  const handleSave_Version = async () => {// post save version
    try {
      const response = await fetchWithAuth(
        `https://genai-backend-2gji.onrender.com/api/events/${id}/save-version/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ event_snapshot: formData }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`POST failed: ${response.status} ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log("Save data", data);
      
      setIsEditing(false);
      alert("Successfully save event version.");    
      // Get the version list again
      const res = await fetchWithAuth(
        `https://genai-backend-2gji.onrender.com/api/events/${id}/versions/`, 
        {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });
      if (!res.ok) throw new Error("Failed to fetch updated versions");
      const updatedVersions = await res.json();
      // Add sort
        const sortedUpdatedVersions = [...updatedVersions].sort(
          (a, b) => a.version_number - b.version_number
        );

      setVersions(sortedUpdatedVersions);
      setSelectedVersion(`v${sortedUpdatedVersions.length}`);

    } catch (err) {
      console.error("Failed to save changes:", err);
      alert("Failed to save changes.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      {/* Left menu (Menu + Back) */}
    <div className="w-64 p-6 border-r border-white/10 bg-white/5 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold mb-4">📌 Menu</h3>
        <ul className="space-y-2">
          {sidebarItems.map((item, index) => {
            const enabled = isItemEnabled(item);
            return (
              <li
                key={index}
                className={`p-2 rounded-xl transition ${
                  enabled
                    ? "hover:bg-white/20 cursor-pointer text-white"
                    : "text-gray-500 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (enabled) handleFunctionClick(item.key);
                }}
              >
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>

      <button
        onClick={() => navigate("/upcoming-events")}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 text-sm rounded-lg shadow border border-gray-400"
      >
        ← Back
      </button>
    </div> 

    {/* Version menu */}
    <div className="w-32 p-4 border-r border-white/10 bg-white/5">
      <h3 className="text-md font-semibold mb-4 text-cyan-300">Version</h3>
      
      {/* Map UI version numbers (v1, v2, v3) when rendering versions list */}
      <ul className="space-y-2">
          {versions.map((ver, index) => (
            <li key={ver.id}>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg transition ${
                  selectedVersion === `v${index + 1}`
                    ? "bg-cyan-600 text-white"
                    : "hover:bg-white/10 text-gray-300"
                }`}
                onClick={() => setSelectedVersion(`v${index + 1}`)}
              >
                {`v${index + 1}`}
              </button>
            </li>
          ))}
        </ul>

    </div>

      {/* Right main content */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">
          🧾 Event {selectedVersion ? `- ${selectedVersion.toUpperCase()}` : ""}
        </h2>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl h-[400px] overflow-y-auto shadow-inner text-sm leading-relaxed space-y-2">
        {error ? (
          <p className="text-red-400">Fail to load：{error}</p>
        ) : !eventData ? (
          <p>Loading ...</p>
        ) : isEditing ? (
          <>
            <label>
              🎉 Name:
              <input
                className="text-black p-1 ml-2 rounded"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
              />
            </label><br />

            <label>
              📣 Slogan:
              <input
                className="text-black p-1 ml-2 rounded"
                name="slogan"
                value={formData.slogan || ""}
                onChange={handleChange}
              />
            </label><br />

            <label>
              📋 Description:<br />
              <textarea
                className="text-black w-full p-1 rounded"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
              />
            </label><br />

            <label>
              📆 Start:
              <input
                className="text-black p-1 ml-2 rounded"
                name="start_time"
                value={formData.start_time || ""}
                onChange={handleChange}
              />
            </label><br />

            <label>
              📆 End:
              <input
                className="text-black p-1 ml-2 rounded"
                name="end_time"
                value={formData.end_time || ""}
                onChange={handleChange}
              />
            </label><br />

            <label>
              👥 Expected Attendees:
              <input
                className="text-black p-1 ml-2 rounded"
                name="expected_attendees"
                value={formData.expected_attendees || ""}
                onChange={handleChange}
              />
            </label><br />

            <label>
              💰 Budget:
              <input
                className="text-black p-1 ml-2 rounded"
                name="budget"
                value={formData.budget || ""}
                onChange={handleChange}
              />
            </label><br />
            <label>
            🎯 Audience:
              <select
                name="target_audience"
                value={formData.target_audience || ""}
                onChange={handleChange}
                className="text-black p-1 ml-2 rounded"
              >
                <option value="" disabled>Select Audience</option>
                {AUDIENCE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </label><br />
            

            {/* Add EVENT_TYPE_OPTIONS drop-down selection */}
            <label>
              📂 Event Type:
              <select
                name="type"
                value={formData.type || ""}
                onChange={handleChange}
                className="text-black p-1 ml-2 rounded"
              >
                <option value="" disabled>Select Type</option>
                {EVENT_TYPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </label><br />

    </>
      ) : (
        <>
          <p><strong>🎉 Name:</strong> {eventData.name}</p>
          <p><strong>📣 Slogan:</strong> {eventData.slogan}</p>
          <p><strong>📋 Description:</strong> {eventData.description}</p>
          <p><strong>📆 Date:</strong> {eventData.start_time} ~ {eventData.end_time}</p>
          <p><strong>👥 Expected Attendees:</strong> {eventData.expected_attendees}</p>
          <p><strong>💰 Budget:</strong> {eventData.budget}</p>
          <p><strong>🎯 Audience:</strong> {eventData.target_audience}</p> 
          <p><strong>📂 Event Type:</strong> {eventData.type}</p>
        </>
      )}
    </div>


        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSave_Change}
                className="bg-cyan-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Save Change
              </button>
            </>
          ) : (
             <>
            <button
              onClick={handleEdit}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
            >
              Change
            </button>

            <button
                onClick={handleSave_Version}
                className="bg-cyan-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Save Version
              </button>

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;