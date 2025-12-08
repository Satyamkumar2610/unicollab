# UniCollab

A web platform for university students to discover projects, form teams, and collaborate.

**Live Demo:** https://unicollab-psi.vercel.app/

## About

UniCollab helps students find project collaborators and teams. Whether you're looking for hackathon teammates or want to join ongoing research, this platform connects you with the right people.

## Features

- Browse and search projects by category and skills
- Create and manage projects
- Form and join teams based on university or interests
- Track your collaborations through a personal dashboard
- User profiles with skills and contact information
- Project workspaces for team coordination

## Tech Stack

**Frontend:** React, Tailwind CSS, Framer Motion  
**Backend:** Node.js, Express, MongoDB  
**Authentication:** JWT with bcrypt

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Satyamkumar2610/unicollab.git
cd unicollab
```

2. Install dependencies
```bash
npm run install-all
```

3. Configure environment variables

Create `backend/.env`:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3001
```

Create `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:3001/api
```

4. Run the application
```bash
npm start
```

Frontend runs on http://localhost:3000  
Backend runs on http://localhost:3001

## Project Structure

```
unicollab/
├── backend/
│   ├── middleware/        # Authentication middleware
│   ├── models/           # Database schemas
│   ├── routes/           # API endpoints
│   ├── utils/            # Helper functions
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # React contexts (auth, theme)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   └── services/     # API service layer
│   └── public/
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `POST /api/projects/:id/join` - Join a project
- `POST /api/projects/:id/leave` - Leave a project

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create team
- `GET /api/teams/:id` - Get team details
- `POST /api/teams/:id/join` - Join a team
- `POST /api/teams/:id/leave` - Leave a team

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `GET /api/users/collaborations` - Get user's collaborations

## Deployment

The frontend is deployed on Vercel and the backend can be deployed on Railway, Render, or Heroku.

For frontend deployment, set the environment variable:
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

## License

MIT

## Contact

Created by [@Satyamkumar2610](https://github.com/Satyamkumar2610)
