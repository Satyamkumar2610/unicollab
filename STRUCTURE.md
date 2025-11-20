# 📁 Project Structure

## Optimized Folder Organization

```
unicollab/
│
├── backend/
│   ├── middleware/
│   │   └── auth.js                 # JWT authentication middleware
│   │
│   ├── models/
│   │   ├── user.js                 # User schema
│   │   └── project.js              # Project schema
│   │
│   ├── routes/
│   │   ├── auth.js                 # Auth endpoints (register, login)
│   │   ├── project.js              # Project CRUD endpoints
│   │   └── user.js                 # User profile endpoints
│   │
│   ├── .env                        # Environment variables
│   ├── server.js                   # Express server setup
│   └── package.json                # Backend dependencies
│
├── frontend/
│   ├── public/
│   │   ├── index.html              # Main HTML file
│   │   ├── favicon.ico
│   │   └── manifest.json
│   │
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js           # Navigation component
│   │   │
│   │   ├── contexts/
│   │   │   └── AuthContext.js      # Auth state management
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.js             # Landing page
│   │   │   ├── Login.js            # Login page
│   │   │   ├── Register.js         # Registration page
│   │   │   ├── Dashboard.js        # User dashboard
│   │   │   ├── BrowseProjects.js   # Browse all projects
│   │   │   ├── ProjectDetail.js    # Project details page
│   │   │   ├── CreateProject.js    # Create project form
│   │   │   ├── MyProjects.js       # User's projects
│   │   │   ├── Profile.js          # User profile
│   │   │   └── Competitions.js     # Competitions page
│   │   │
│   │   ├── services/
│   │   │   └── api.js              # Axios API client
│   │   │
│   │   ├── App.js                  # Main app component
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Global styles (Tailwind)
│   │
│   ├── .env                        # Environment variables
│   ├── tailwind.config.js          # Tailwind configuration
│   ├── postcss.config.js           # PostCSS configuration
│   └── package.json                # Frontend dependencies
│
├── README.md                       # Project documentation
├── STRUCTURE.md                    # This file
└── .gitignore                      # Git ignore rules
```

## Key Files

### Backend
- **server.js** - Express app initialization and route setup
- **middleware/auth.js** - JWT token verification
- **models/** - MongoDB schemas
- **routes/** - API endpoints

### Frontend
- **App.js** - Main routing and layout
- **contexts/AuthContext.js** - Global auth state
- **services/api.js** - API client with interceptors
- **pages/** - Page components
- **components/** - Reusable components

## Removed Files

✅ Deleted unused CSS files (using Tailwind)  
✅ Deleted debug/test files  
✅ Deleted unused routes (comments, competitions, dashboard, requests)  
✅ Deleted unused models  
✅ Deleted duplicate pages  
✅ Consolidated documentation  

## File Count

- **Backend**: 8 files (lean and focused)
- **Frontend**: 15 files (organized by feature)
- **Total**: ~23 source files (optimized)

## Best Practices Applied

✅ Separation of concerns  
✅ Modular structure  
✅ Clear naming conventions  
✅ Minimal dependencies  
✅ No dead code  
✅ Easy to maintain  
✅ Scalable architecture  
