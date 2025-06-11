import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AddEvent from "./pages/AddEvent"; 
import UpcomingEvents from "./pages/UpcomingEvents"; 
import Reminders from "./pages/Reminders";
import History from "./pages/History"; 
import UserProfile from "./pages/UserProfile"; 
import EventDetailPage from "./pages/EventDetailPage";
import PosterInfo from "./pages/Poster_info";
import PosterTemplate from "./pages/Poster_template";
import AssignmentTask from "./pages/Assignment_task";
import ChooseName from "./pages/ChooseName";
import ChooseSlogan from "./pages/ChooseSlogan";
import Event_Description from "./pages/Event_Description";


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
        
        <Route path="/assignment-task" element={<AssignmentTask />} /> 
        <Route path="/choose-name" element={<ChooseName />} /> 
        <Route path="/choose-slogan" element={<ChooseSlogan />} /> 
        <Route path="/event-description" element={<Event_Description />} /> 
        {/* assignment-task */}

        <Route path="/event/:id" element={<EventDetailPage />} /> 
        <Route path="/event/:id/:version/poster-info" element={<PosterInfo />} />
        <Route path="/event/:id/:version/poster-template" element={<PosterTemplate />} />

      </Routes>
    </Router>
  );
}

export default App;