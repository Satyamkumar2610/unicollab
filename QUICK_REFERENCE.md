# 🚀 Quick Reference Guide

## Start the Project

```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend  
cd frontend && npm start
```

**Open**: http://localhost:3000

---

## Project Structure at a Glance

```
unicollab/
├── backend/          (8 files - lean & focused)
├── frontend/         (15 files - organized)
└── docs/             (4 markdown files)
```

---

## Key Files

| File | Purpose |
|------|---------|
| `backend/server.js` | Express setup |
| `backend/routes/` | API endpoints |
| `backend/models/` | Database schemas |
| `frontend/src/App.js` | Main app |
| `frontend/src/pages/` | Page components |
| `frontend/src/contexts/AuthContext.js` | Auth state |

---

## API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
POST   /api/projects/:id/join
POST   /api/projects/:id/leave
```

---

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/unicollab
JWT_SECRET=your_secret_key
PORT=3001
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001/api
```

---

## Features

✅ Register & Login  
✅ Create Projects  
✅ Browse & Search  
✅ Join/Leave  
✅ Dashboard  
✅ Profile  

---

## Tech Stack

- React 18 + Tailwind CSS
- Node.js + Express
- MongoDB + JWT
- Axios + React Router

---

## File Count

- Backend: 8 files
- Frontend: 15 files
- Total: 23 source files

---

## Documentation

- `README.md` - Overview
- `STRUCTURE.md` - Folder layout
- `OPTIMIZATION.md` - Changes
- `FINAL_SUMMARY.md` - Summary
- `CHECKLIST.md` - Verification
- `QUICK_REFERENCE.md` - This file

---

## Status

✅ **PRODUCTION READY**

All features working, optimized, and documented.

---

## Next Steps

1. Start both servers
2. Register account
3. Create project
4. Explore features
5. Deploy when ready

---

**Happy Coding! 🎓**
