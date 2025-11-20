# 🎓 UniCollab - University Collaboration Platform

A modern full-stack web application for university students to discover, create, and collaborate on projects.

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
npm start
```
Runs on `http://localhost:3001`

### Frontend
```bash
cd frontend
npm install
npm start
```
Runs on `http://localhost:3000`

## 📋 Features

✅ User Registration & Login  
✅ Create & Manage Projects  
✅ Browse & Search Projects  
✅ Join/Leave Projects  
✅ Dashboard with Statistics  
✅ User Profiles  
✅ Responsive Design  
✅ Modern UI with Tailwind CSS  

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router v6
- Axios
- Tailwind CSS

**Backend:**
- Node.js
- Express
- MongoDB
- JWT Authentication
- bcryptjs

## 📁 Project Structure

```
unicollab/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── user.js
│   │   └── project.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── project.js
│   │   └── user.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── BrowseProjects.js
│   │   │   ├── ProjectDetail.js
│   │   │   ├── CreateProject.js
│   │   │   ├── MyProjects.js
│   │   │   ├── Profile.js
│   │   │   ├── Competitions.js
│   │   │   └── Projects.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .env
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
```

## 🔧 Environment Setup

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/unicollab
JWT_SECRET=your_secret_key_here
PORT=3001
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001/api
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `POST /api/projects/:id/join` - Join project
- `POST /api/projects/:id/leave` - Leave project

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile

## 🎨 Design Features

- Glassmorphism cards with backdrop blur
- Gradient backgrounds (purple/pink/indigo)
- Smooth animations and transitions
- Fully responsive layout
- Dark theme

## 🧪 Testing

1. Register a new account
2. Create a project
3. Browse and search projects
4. Join/leave projects
5. View dashboard and profile

## 🚀 Deployment

**Backend:** Heroku, Railway, or any Node.js hosting  
**Frontend:** Vercel, Netlify, or any static hosting

## 📝 License

MIT License

## 👥 Authors

UniCollab Team

---

**Made with ❤️ for university students**
