import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AddEvent from "./pages/AddEvent"; 
import UpcomingEvents from "./pages/UpcomingEvents"; // implement here
import Reminders from "./pages/Reminders"; // implement here
import History from "./pages/History"; 
import UserProfile from "./pages/UserProfile"; // implement here
import EventDetailPage from "./pages/EventDetailPage";
import EventVersionPage from "./pages/EventVersionPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/add-event" element={<AddEvent />} />
        <Route path="/upcoming-events" element={<UpcomingEvents />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/history" element={<History />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/event/:id" element={<EventDetailPage />} />
        <Route path="/event/:id/:version" element={<EventVersionPage />} />
      </Routes>
    </Router>
  );
}

export default App;