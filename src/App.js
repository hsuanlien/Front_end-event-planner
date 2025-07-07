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

import Venue from "./pages/Venue";
import ChooseVenue from "./pages/ChooseVenue";
import Invitation from "./pages/Invitation";
import CheckInvitation from "./pages/CheckInvitation";
import Copywriting from "./pages/Copywriting";
import CheckCopywriting from "./pages/CheckCopywriting";
import Registration from "./pages/Registration";
import CheckRegistration from "./pages/CheckRegistration";
import ChooseEventTime from "./pages/ChooseEventTime";
import Forget_Passwort from "./pages/ForgetPasswort";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />  
        <Route path="/home" element={<HomePage />} />  
        {/* <Route path="/" element={<HomePage />} />    */}

        <Route path="/register" element={<RegisterPage />} />

  {/* --------------------------------- */}
        <Route path="/add-event" element={<AddEvent />} />
        <Route path="/upcoming-events" element={<UpcomingEvents />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/history" element={<History />} />
        <Route path="/user-profile" element={<UserProfile />} />
        
        <Route path="/choose-name" element={<ChooseName />} /> 
        <Route path="/choose-slogan" element={<ChooseSlogan />} /> 
        <Route path="/event-description" element={<Event_Description />} /> 

        <Route path="/event/:id/" element={<EventDetailPage />} />  
         {/* ----------------- 0701 Test----------------- */}
        {/* <Route path="/" element={<EventDetailPage />} />   */}
        
        <Route path="/event/:id/choose-event-time" element={<ChooseEventTime />} />
        {/* ----------------- */}
        <Route path="/event/:id/assignment-task" element={<AssignmentTask />} /> 
        {/* <Route path="/event/:id:version/assignment-task" element={<AssignmentTask />} />  */}
        <Route path="/event/:id/:version/poster-info" element={<PosterInfo />} />
        <Route path="/event/:id/:version/poster-template" element={<PosterTemplate />} />
        {/* ----------------- */}
        {/* <Route path="/event/:id/:version/venue" element={<Venue />} />
        <Route path="/event/:id/:version/choose-venue" element={<ChooseVenue />} /> */}
        <Route path="/event/:id/venue" element={<Venue />} />
        <Route path="/event/:id/choose-venue" element={<ChooseVenue />} />
        {/* ----------------- */}
        {/* <Route path="/event/:id/:version/invitation" element={<Invitation />} />
        <Route path="/event/:id/:version/check-invitation" element={<CheckInvitation />} /> */}
        <Route path="/event/:id/invitation" element={<Invitation />} />
        <Route path="/event/:id/check-invitation" element={<CheckInvitation />} />
        {/* ----------------- */}
        {/* <Route path="/event/:id/:version/copywriting" element={<Copywriting />} />
        <Route path="/event/:id/:version/check-copywriting" element={<CheckCopywriting />} /> */}
         <Route path="/event/:id/copywriting" element={<Copywriting />} />
        <Route path="/event/:id/check-copywriting" element={<CheckCopywriting />} />
        {/* ----------------- */}
        {/* <Route path="/event/:id/:version/registration" element={<Registration />} />
        <Route path="/event/:id/:version/check-registration" element={<CheckRegistration />} /> */}
        <Route path="/event/:id/registration" element={<Registration />} />
        <Route path="/event/:id/check-registration" element={<CheckRegistration />} />
        
        <Route path="/forget-passwort" element={<Forget_Passwort />} />

      </Routes>
    </Router>
  );
}

export default App;