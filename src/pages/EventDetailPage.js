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
  const [isMenuOpen, setIsMenuOpen] = useState(false);   // Mobile menu default closed
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);  // Desktop menu default expanded

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
    
    // Automatically close mobile menu when an item is clicked
    setIsMenuOpen(false);
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

  // Effect to prevent background scrolling when menu is open on mobile
  // and handle click outside to close menu
  useEffect(() => {
    // 只在手機版時禁止背景滾動
    // if (window.innerWidth < 768) {
    //   document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    // }
    
    // Add event listener to close menu when clicking outside
    const handleClickOutside = (e) => {
      // 手機版：點擊外部關閉菜單
      if (window.innerWidth < 768 && isMenuOpen && 
          !e.target.closest('button[aria-label="切換導覽"]') && 
          !e.target.closest('div[role="menu"]')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Apply menu collapse state through direct DOM manipulation (as a fallback)
  useEffect(() => {
    console.log("Menu collapsed state changed:", isMenuCollapsed);
    const menuElement = document.querySelector('div[role="menu"]');
    if (menuElement) {
      if (isMenuCollapsed) {
        // 收攏時更窄
        menuElement.style.width = window.innerWidth > 768 ? '3.5rem' : '5rem'; // 更窄的桌機版寬度
        menuElement.style.padding = window.innerWidth > 768 ? '0.5rem' : '1rem';
      } else {
        // 展開時正常寬度
        menuElement.style.width = '16rem';
        menuElement.style.padding = '1.5rem';
      }
    }
    
    // 同步漢堡按鈕的狀態
    const hamburgerButton = document.querySelector('button[aria-label="切換導覽"]');
    if (hamburgerButton && window.innerWidth >= 768) {
      // 在桌機版，同步漢堡按鈕的展開/收攏視覺狀態
      hamburgerButton.setAttribute('aria-expanded', isMenuCollapsed);
    }
  }, [isMenuCollapsed]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      {/* Hamburger button for mobile - now also controls menu collapse */}
      <button
        onClick={() => {
          // 在手機版，控制菜單的顯示/隱藏
          setIsMenuOpen((prev) => !prev);
          
          // 在桌機版，控制菜單的收攏/展開
          if (window.innerWidth >= 768) {
            const newState = !isMenuCollapsed;
            setIsMenuCollapsed(newState);
            // 更新菜單元素的數據屬性
            const menuElement = document.querySelector('div[role="menu"]');
            if (menuElement) {
              menuElement.dataset.collapsed = newState;
            }
          }
        }}
        aria-label="切換導覽"
        aria-expanded={isMenuOpen}
        className="fixed top-4 left-4 p-2 bg-gray-800 shadow-lg backdrop-blur rounded-lg z-50 border-2 border-cyan-600/70"
      >
        {/* Three-line & cross animation */}
        <span
          className={`block h-0.5 w-6 bg-white transition mb-1.5
                    ${isMenuOpen && 'translate-y-2 rotate-45'}`}
        />
        <span
          className={`block h-0.5 w-6 bg-white transition mb-1.5
                    ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}
        />
        <span
          className={`block h-0.5 w-6 bg-white transition
                    ${isMenuOpen && '-translate-y-2 -rotate-45'}`}
        />
      </button>
      
      {/* Left menu (Menu + Back) */}
      <div 
        role="menu"
        className={`
          fixed top-0 left-0 h-full border-r border-white/10 bg-white/5 
          flex flex-col justify-between z-40 bg-gray-900/95 backdrop-blur
          transition-all duration-300 ease-in-out p-6
          md:static md:translate-x-0 w-64
          ${isMenuCollapsed ? 'md:w-20 md:p-3' : 'md:w-64'}
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div>
          <div className="flex justify-between items-center mb-4" style={{ width: '100%' }}>
            {/* 讓菜單標題可點擊，並與漢堡按鈕邏輯同步 */}
            <div 
              onClick={() => {
                // 同步漢堡按鈕的邏輯
                setIsMenuOpen((prev) => !prev);
                
                // 同時更新收攏狀態
                const newState = !isMenuCollapsed;
                setIsMenuCollapsed(newState);
                
                // 更新菜單元素的數據屬性
                const menuElement = document.querySelector('div[role="menu"]');
                if (menuElement) {
                  menuElement.dataset.collapsed = newState;
                }
              }}
              className="rounded cursor-pointer hover:bg-white/10 p-1"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: isMenuCollapsed ? 'center' : 'flex-start',
                flex: '1'
              }}
              title="點擊收攏/展開選單"
            >
              <span className="text-xl" style={{ marginRight: isMenuCollapsed ? '0' : '0.5rem' }}>📌</span>
              {!isMenuCollapsed && <span className="font-bold">Menu</span>}
            </div>
            
            <div className="flex">
              {/* 桌面版展開/收縮按鈕 */}
              <button 
                onClick={() => {
                  // 點擊這個按鈕時，更新收攏狀態
                  const newState = !isMenuCollapsed;
                  console.log("Menu collapse toggle:", newState);
                  setIsMenuCollapsed(newState);
                  // 強制為按鈕元素添加 data 屬性作為額外狀態指示器
                  document.querySelector('div[role="menu"]').dataset.collapsed = newState;
                  // 同時也更新漢堡按鈕狀態，保持一致
                  if (window.innerWidth >= 768) {
                    setIsMenuOpen(newState);
                  }
                }}
                className="hidden p-1 rounded hover:bg-white/10 border border-gray-600"
                aria-label={isMenuCollapsed ? "展開選單" : "收縮選單"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  {isMenuCollapsed ? (
                    // 右箭頭圖示 (展開)
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  ) : (
                    // 左箭頭圖示 (收縮)
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  )}
                </svg>
              </button>
              
              {/* 手機版關閉按鈕 */}
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="md:hidden p-1 rounded hover:bg-white/10"
                aria-label="關閉選單"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <ul className={`space-y-2 ${isMenuCollapsed ? 'md:space-y-4' : ''}`}>
            {sidebarItems.map((item, index) => {
              const enabled = isItemEnabled(item);
              const iconMap = {
                "Task assignment": "📋",
                "場地": "🏢",
                "報名表單": "📝",
                "邀請函": "✉️",
                "文案": "📢"
              };
              const icon = iconMap[item.key] || "🔷";
              
              return (
                <li
                  key={index}
                  title={item.label}
                  className={`rounded-xl transition ${isMenuCollapsed ? 'md:p-1 md:text-center' : 'p-2'} ${
                    enabled
                      ? "hover:bg-white/20 cursor-pointer text-white"
                      : "text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (enabled) {
                      handleFunctionClick(item.key);
                      setIsMenuOpen(false); // Close menu after clicking
                    }
                  }}
                >
                  <div className="flex items-center" style={{
                    justifyContent: isMenuCollapsed ? 'center' : 'flex-start',
                    flexDirection: isMenuCollapsed ? 'column' : 'row',
                    width: '100%',
                    transition: 'all 0.3s ease',
                  }}>
                    <div style={{ 
                      fontSize: isMenuCollapsed ? '1.5rem' : 'inherit',
                      marginBottom: isMenuCollapsed ? '0.25rem' : '0',
                      marginRight: isMenuCollapsed ? '0' : '0.75rem',
                      transition: 'all 0.3s ease',
                    }}>{icon}</div>
                    <span style={{ 
                      display: isMenuCollapsed ? 'none' : 'inline',
                      opacity: isMenuCollapsed ? 0 : 1,
                      transition: 'opacity 0.3s ease',
                      whiteSpace: 'nowrap',
                    }}>{item.label}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          onClick={() => navigate("/upcoming-events")}
          className="bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow border border-gray-400 w-full transition-all"
          style={{
            display: 'flex',
            justifyContent: isMenuCollapsed ? 'center' : 'flex-start',
            padding: isMenuCollapsed ? '0.75rem 0' : '0.5rem 1rem',
            fontSize: isMenuCollapsed ? '1.25rem' : '0.875rem',
            transition: 'all 0.3s ease'
          }}
          title="Back to Events"
        >
          {isMenuCollapsed ? (
            <span style={{ transition: 'all 0.3s ease' }}>←</span>
          ) : (
            <span style={{ transition: 'all 0.3s ease' }}>← Back</span>
          )}
        </button>
      </div> 

      {/* Version menu - only visible on larger screens */}
      <div className={`border-r border-white/10 bg-white/5 md:block hidden transition-all duration-300
                      ${isMenuCollapsed ? 'w-28 p-3' : 'w-32 p-4'}`}>
        <h3 className="text-md font-semibold mb-4 text-cyan-300">
          {isMenuCollapsed ? 'Ver.' : 'Version'}
        </h3>
        
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
      <div className="flex-1 p-6 md:ml-0">
        <h2 className="text-2xl font-bold mb-4 md:mt-0 mt-16">
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
