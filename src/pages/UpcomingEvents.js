// src/pages/UpcomingEvents.js
import { fetchWithAuth } from "../utils/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_BASE = "https://genai-backend-2gji.onrender.com/api"; // Django API base

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [deleteMode, setDeleteMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(window.innerWidth < 768 ? true : false); // 手機版菜單預設開啟狀態
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(true); // 桌面版菜單預設收縮狀態
  // const token = localStorage.getItem("access_token");
  
  // 首次渲染時設置菜單初始狀態
  useEffect(() => {
    // 立即應用菜單縮小狀態
    const menuElement = document.querySelector('aside[role="menu"]');
    if (menuElement && isMenuCollapsed) {
      // 初始化時應用縮小樣式
      menuElement.style.width = window.innerWidth > 768 ? '3.5rem' : '3.5rem';
      menuElement.style.padding = window.innerWidth > 768 ? '0.5rem' : '1rem';
      
      // 設置數據屬性
      menuElement.dataset.collapsed = "true";
    }
  }, []); // 空依賴數組，只在組件掛載時執行一次

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetchWithAuth(`${API_BASE}/events/`, {
          // headers: {
          //   Authorization:`Bearer ${token}`,
          // },
        });

        if (!res.ok) {
          throw new Error("Unable to load event, please check login or permissions");
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

  const handleClick = async (id) => {
    if (deleteMode) {
      handleDelete(id);
      return;
    }
    try {
      const res = await fetchWithAuth(`${API_BASE}/events/${id}/`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });

      if (!res.ok) {
        throw new Error("Unable to load event details");
      }

      const data = await res.json();
      const startTime = data.start_time;
      const endTime = data.end_time;

      // If it is the initial preset value, it means that the time has not been set yet.
      if (
        startTime?.endsWith("00:00:00Z") &&
        endTime?.endsWith("23:59:59Z")
      ) {
        navigate(`/event/${id}/choose-event-time`);
      } else {
        navigate(`/event/${id}`);
      }
    } catch (err) {
      console.error("error：", err);
    }
  };
  const handleLogout = async () => {
    const refresh = localStorage.getItem("refresh_token");

    await fetchWithAuth("https://genai-backend-2gji.onrender.com/accounts/logout/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    axios.defaults.headers.common["Authorization"] = "";
    navigate("/");
  };
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this event?");
    if (!confirm) return;
    try {
      const res = await fetchWithAuth(`${API_BASE}/events/${id}/delete/`, {
        method: "DELETE",
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });

      if (res.status === 204) {
        alert("Event deleted successfully");
        setEvents(events.filter(event => event.id !== id));
      } else {
        const result = await res.json();
        alert(result.error || "Failed to delete event");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  // Effect to prevent background scrolling when menu is open on mobile
  // and handle click outside to close menu
  useEffect(() => {
    // 只在手機版時禁止背景滾動
    if (window.innerWidth < 768) {
      document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    }
    
    // Add event listener to close menu when clicking outside
    const handleClickOutside = (e) => {
      // 手機版：點擊外部關閉菜單
      if (window.innerWidth < 768 && isMenuOpen && 
          !e.target.closest('button[aria-label="切換導覽"]') && 
          !e.target.closest('aside[role="menu"]')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      // 清除時恢復滾動，但不要覆蓋其他可能的設置
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // 監控菜單收縮狀態變化
  useEffect(() => {
    const menuElement = document.querySelector('aside[role="menu"]');
    if (menuElement) {
      // 更新數據屬性
      menuElement.dataset.collapsed = isMenuCollapsed;
      
      // 應用樣式變化
      if (isMenuCollapsed) {
        // 收攏時更窄
        menuElement.style.width = '3.5rem'; 
        menuElement.style.padding = window.innerWidth > 768 ? '0.5rem' : '1rem';
      } else {
        // 展開時正常寬度
        menuElement.style.width = '16rem';
        menuElement.style.padding = '1.5rem';
      }
      
      // 確保不管菜單是收攏還是展開，頁面都可以滾動
      document.body.style.overflow = 'auto';
    }
    
    // 同步漢堡按鈕的狀態
    const hamburgerButton = document.querySelector('button[aria-label="切換導覽"]');
    if (hamburgerButton && window.innerWidth >= 768) {
      // 在桌機版，同步漢堡按鈕的展開/收攏視覺狀態
      hamburgerButton.setAttribute('aria-expanded', !isMenuCollapsed);
    }
  }, [isMenuCollapsed]);

  if (loading) return <div className="text-gray-300">Loading ...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white overflow-hidden">
      {/* Hamburger button for mobile - now also controls menu collapse */}
      <button
        onClick={() => {
          // 在手機版，控制菜單的顯示/隱藏
          if (window.innerWidth < 768) {
            const newMenuState = !isMenuOpen;
            setIsMenuOpen(newMenuState);
            // 只在手機版打開菜單時禁止滾動
            document.body.style.overflow = newMenuState ? 'hidden' : 'auto';
          } else {
            // 在桌機版，只控制菜單的收攏/展開，不影響滾動
            const newState = !isMenuCollapsed;
            setIsMenuCollapsed(newState);
            // 更新菜單元素的數據屬性
            const menuElement = document.querySelector('aside[role="menu"]');
            if (menuElement) {
              menuElement.dataset.collapsed = newState;
            }
            // 確保桌機版始終可滾動
            document.body.style.overflow = 'auto';
          }
        }}
        aria-label="切換導覽"
        aria-expanded={window.innerWidth < 768 ? isMenuOpen : !isMenuCollapsed}
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
      
      {/* Sidebar - with collapsible functionality */}
      <aside 
        role="menu"
        data-collapsed={isMenuCollapsed}
        className={`
          fixed top-0 left-0 h-full border-r border-white/10 bg-white/5 
          flex flex-col justify-between z-40 bg-gray-900/95 backdrop-blur
          transition-all duration-300 ease-in-out 
          md:static md:translate-x-0 
          ${isMenuCollapsed ? 'p-3 w-[3.5rem] md:w-[3.5rem]' : 'p-6 w-64 md:w-64'}
          ${window.innerWidth < 768 ? (isMenuOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        `}
      >
        <div>
          {/* 菜單標題區域 - 可點擊切換收縮狀態 */}
          <div 
            className="flex justify-between items-center mb-6"
            style={{ width: '100%' }}
          >
            <div 
              onClick={() => {
                // 在手機版控制菜單的顯示/隱藏
                if (window.innerWidth < 768) {
                  setIsMenuOpen((prev) => !prev);
                }
                
                // 更新收攏狀態（桌機版主要使用這個）
                const newState = !isMenuCollapsed;
                setIsMenuCollapsed(newState);
                
                // 更新菜單元素的數據屬性
                const menuElement = document.querySelector('aside[role="menu"]');
                if (menuElement) {
                  menuElement.dataset.collapsed = newState;
                }
                
                // 確保頁面可以滾動
                document.body.style.overflow = 'auto';
              }}
              className="rounded cursor-pointer hover:bg-white/10 p-1 text-2xl font-bold tracking-wide drop-shadow-md"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: isMenuCollapsed ? 'center' : 'flex-start',
                flex: '1'
              }}
              title="點擊收攏/展開選單"
            >
              <span className="text-xl" style={{ marginRight: isMenuCollapsed ? '0' : '0.5rem' }}>📌</span>
              {!isMenuCollapsed && <span>Menu</span>}
            </div>
            
            <div className="flex">
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

          {/* 導覽選項 */}
          <nav className="flex flex-col gap-4 text-lg">
            <button
              onClick={() => navigate("/add-event")}
              className="hover:text-cyan-400 transition flex items-center"
              style={{
                justifyContent: isMenuCollapsed ? 'center' : 'flex-start',
                flexDirection: isMenuCollapsed ? 'column' : 'row',
                width: '100%',
              }}
            >
              <span style={{ 
                fontSize: isMenuCollapsed ? '1.5rem' : 'inherit',
                marginBottom: isMenuCollapsed ? '0.25rem' : '0',
                marginRight: isMenuCollapsed ? '0' : '0.75rem',
              }}>➕</span>
              <span style={{ 
                display: isMenuCollapsed ? 'none' : 'inline' 
              }}>Add Event</span>
            </button>

            <button
              onClick={() => setDeleteMode(!deleteMode)}
              className={`transition flex items-center ${
                deleteMode ? "text-red-400" : "hover:text-cyan-400"
              }`}
              style={{
                justifyContent: isMenuCollapsed ? 'center' : 'flex-start',
                flexDirection: isMenuCollapsed ? 'column' : 'row',
                width: '100%',
              }}
            >
              <span style={{ 
                fontSize: isMenuCollapsed ? '1.5rem' : 'inherit',
                marginBottom: isMenuCollapsed ? '0.25rem' : '0',
                marginRight: isMenuCollapsed ? '0' : '0.75rem',
              }}>🗑️</span>
              <span style={{ 
                display: isMenuCollapsed ? 'none' : 'inline' 
              }}>{deleteMode ? "Cancel Delete Mode" : "Delete Events"}</span>
            </button>

            <button
              onClick={() => navigate("/user-profile")}
              className="hover:text-cyan-400 transition flex items-center"
              style={{
                justifyContent: isMenuCollapsed ? 'center' : 'flex-start',
                flexDirection: isMenuCollapsed ? 'column' : 'row',
                width: '100%',
              }}
            >
              <span style={{ 
                fontSize: isMenuCollapsed ? '1.5rem' : 'inherit',
                marginBottom: isMenuCollapsed ? '0.25rem' : '0',
                marginRight: isMenuCollapsed ? '0' : '0.75rem',
              }}>👤</span>
              <span style={{ 
                display: isMenuCollapsed ? 'none' : 'inline' 
              }}>User Profile</span>
            </button>
          </nav>
        </div>

        {/* Log out button */}
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 flex items-center"
          style={{
            justifyContent: isMenuCollapsed ? 'center' : 'flex-start',
            flexDirection: isMenuCollapsed ? 'column' : 'row',
            width: '100%',
          }}
        >
          <span style={{ 
            fontSize: isMenuCollapsed ? '1.5rem' : 'inherit',
            marginBottom: isMenuCollapsed ? '0.25rem' : '0',
            marginRight: isMenuCollapsed ? '0' : '0.75rem',
          }}>🚪</span>
          <span style={{ 
            display: isMenuCollapsed ? 'none' : 'inline' 
          }}>Log out</span>
        </button>
      </aside>

      {/* Main Content*/}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-6 text-cyan-300 drop-shadow md:mt-0 mt-16">
            Upcoming Events
          </h2>

          <ul className="space-y-4 w-full max-w-lg">
            {events.map((event) => {
              const displayName = event.name || "（Unknown event）";
              const displayDate = event.start_time?.slice(0, 10) || "Unknown date";

              return (
                <li
                  key={event.id}
                  className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow border border-white/10 flex justify-between items-center hover:bg-white/20 transition"
                >
                  <div
                    onClick={() => {
                      if (!deleteMode) handleClick(event.id);
                    }}
                    className={`${!deleteMode ? "cursor-pointer" : ""} flex flex-col`}
                  >
                    <span className="font-medium text-white">{displayName}</span>
                    <span className="text-sm text-white/70">{displayDate}</span>
                  </div>

                  {deleteMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(event.id);
                      }}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow border-cyan-400"
                    >
                      Delete
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default UpcomingEvents;