# EventIQ - AI-Powered Event Planning Platform — Frontend
This is the React frontend for our final project, an AI-powered event planning platform. It allows users to create, manage, and customize events with the help of AI tools such as task assignment, venue selection, invitation letters, social media copywriting, and more.
This frontend connects to a Django backend with JWT authentication.

## Features
1.User Authentication (JWT with access/refresh tokens)
2.Event Creation with AI-generated names, slogans, and descriptions
3.Task Assignment with editable roles, descriptions, and times
4.Venue Selection for recommending or choosing locations
5.Registration Form and Invitation Letter modules
6.Social Media Post Generator
7.Version Control for saving and restoring past event states
8.Access Control — certain features are locked until prerequisites (like task assignment and venue selection) are completed

### Getting Started
Our project is deployed and accessible at [https://front-end-event-planner.vercel.app]. Feel free to explore and try it out!

### Project Structure Highlights
``` 
src/
├── pages/      # All major pages (AddEvent, EventDetailPage, TaskAssignment, etc.)
├── utils/      # Authentication utilities (e.g., fetchWithAuth with auto refresh)
├── App.js      # Main routing setup
``` 
    
### Authentication Notes
We use JWT (JSON Web Token):
1.Login returns access and refresh tokens.
2.The fetchWithAuth() utility automatically refreshes the access token when it expires.
3.Refresh token is blacklisted upon logout.