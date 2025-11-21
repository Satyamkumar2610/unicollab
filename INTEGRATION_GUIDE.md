# Integration Guide - UniCollab Upgrade

## Quick Start

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Update Environment Variables
```bash
# backend/.env
MONGODB_URI=mongodb://localhost:27017/unicollab
JWT_SECRET=your_super_secret_key_change_this_in_production
PORT=3001
```

#### Start Backend
```bash
npm start
# or for development with auto-reload
npm run dev
```

### 2. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Update Environment Variables
```bash
# frontend/.env
REACT_APP_API_URL=http://localhost:3001/api
```

#### Start Frontend
```bash
npm start
```

## Integration Steps

### Step 1: Database Migrations
The new models are automatically created by Mongoose on first connection:
- Notification
- CollaborationRequest
- Team

No manual migrations needed.

### Step 2: Update User Model (Optional)
Add avatar field to existing User model for profile pictures:
```javascript
// backend/models/user.js
avatar: { type: String, default: null }
```

### Step 3: Update Project Model (Optional)
Add category field for better filtering:
```javascript
// backend/models/project.js
category: { type: String, default: 'other' }
```

### Step 4: Test API Endpoints

#### Test Notifications
```bash
# Get notifications
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/notifications?page=1&limit=10

# Get unread count
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/notifications/unread/count
```

#### Test Projects with Pagination
```bash
# List projects with filters
curl http://localhost:3001/api/projects?page=1&limit=10&search=web&status=active
```

#### Test Teams
```bash
# Create team
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Team A","description":"..."}' \
  http://localhost:3001/api/teams
```

### Step 5: Frontend Integration

#### Update Navbar (Optional)
Add links to new pages:
```javascript
<Link to="/notifications">Notifications</Link>
<Link to="/explore">Explore</Link>
<Link to="/teams">Teams</Link>
```

#### Use New Components
```javascript
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { EmptyState } from './components/EmptyState';
import { Pagination } from './components/Pagination';
import { ListFilters } from './components/ListFilters';
```

#### Use New Hooks
```javascript
import { usePagination } from './hooks/usePagination';
import { useList } from './hooks/useList';

const { page, limit, goToPage } = usePagination();
const { data, metadata, loading, error, refetch } = useList(fetchFn, [page]);
```

## File Structure

### Backend
```
backend/
├── models/
│   ├── user.js
│   ├── project.js
│   ├── notification.js (NEW)
│   ├── collaborationRequest.js (NEW)
│   └── team.js (NEW)
├── routes/
│   ├── auth.js
│   ├── project.js (UPDATED)
│   ├── user.js
│   ├── notification.js (NEW)
│   ├── collaborationRequest.js (NEW)
│   └── team.js (NEW)
├── middleware/
│   └── auth.js
├── utils/
│   └── listResponse.js (NEW)
└── server.js (UPDATED)
```

### Frontend
```
frontend/src/
├── components/
│   ├── Navbar.js
│   ├── Footer.js
│   ├── LoadingState.js (NEW)
│   ├── ErrorState.js (NEW)
│   ├── EmptyState.js (NEW)
│   ├── Pagination.js (NEW)
│   └── ListFilters.js (NEW)
├── pages/
│   ├── Home.js
│   ├── Login.js
│   ├── Register.js
│   ├── Dashboard.js
│   ├── BrowseProjects.js
│   ├── ProjectDetail.js
│   ├── CreateProject.js
│   ├── MyProjects.js
│   ├── Profile.js
│   ├── Competitions.js
│   ├── Notifications.js (NEW)
│   ├── Explore.js (NEW)
│   └── Teams.js (NEW)
├── hooks/
│   ├── usePagination.js (NEW)
│   └── useList.js (NEW)
├── utils/
│   └── queryBuilder.js (NEW)
├── contexts/
│   └── AuthContext.js
├── services/
│   └── api.js (UPDATED)
└── App.js (UPDATED)
```

## Testing Checklist

### Backend Tests
- [ ] Create project with pagination
- [ ] Search projects by title/description
- [ ] Filter projects by status and category
- [ ] Sort projects by different fields
- [ ] Create collaboration request
- [ ] Accept/reject collaboration request
- [ ] Create team
- [ ] Add/remove team members
- [ ] Create notification
- [ ] Mark notification as read
- [ ] List notifications with filters

### Frontend Tests
- [ ] Navigate to Explore page
- [ ] Search and filter projects
- [ ] Paginate through projects
- [ ] Join project from Explore
- [ ] Navigate to Notifications page
- [ ] Mark notifications as read
- [ ] Navigate to Teams page
- [ ] Create new team
- [ ] Search and filter teams
- [ ] Paginate through teams

## Common Issues & Solutions

### Issue: API returns 404 for new endpoints
**Solution:** Ensure server.js has all new routes registered:
```javascript
app.use('/api/notifications', require('./routes/notification'));
app.use('/api/collaboration-requests', require('./routes/collaborationRequest'));
app.use('/api/teams', require('./routes/team'));
```

### Issue: Pagination metadata not showing
**Solution:** Ensure buildListResponse is imported and used:
```javascript
const { buildListResponse } = require('../utils/listResponse');
res.json(buildListResponse(data, total, page, limit));
```

### Issue: Frontend components not rendering
**Solution:** Verify imports are correct:
```javascript
import { LoadingState } from '../components/LoadingState';
import { usePagination } from '../hooks/usePagination';
```

### Issue: Authentication failing on new routes
**Solution:** Ensure auth middleware is applied:
```javascript
router.get('/', auth, async (req, res) => { ... });
```

## Performance Optimization

### Database Indexing
Add indexes for frequently searched fields:
```javascript
// In models
projectSchema.index({ title: 'text', description: 'text' });
projectSchema.index({ status: 1 });
projectSchema.index({ category: 1 });
teamSchema.index({ name: 'text', description: 'text' });
```

### Caching Strategy
Implement Redis caching for:
- Project lists (cache for 5 minutes)
- Team lists (cache for 5 minutes)
- User profiles (cache for 10 minutes)

### Query Optimization
- Use `.select()` to limit fields returned
- Use `.lean()` for read-only queries
- Implement pagination to limit results

## Deployment

### Environment Variables
```bash
# Production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/unicollab
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
PORT=3001
REACT_APP_API_URL=https://api.unicollab.com
```

### Backend Deployment (Heroku)
```bash
git push heroku main
heroku logs --tail
```

### Frontend Deployment (Vercel)
```bash
npm run build
vercel --prod
```

## Monitoring & Logging

### Backend Logging
```javascript
console.log('Creating project:', req.body);
console.error('Error:', error.message);
```

### Frontend Error Tracking
```javascript
try {
  const response = await api.get('/projects');
} catch (error) {
  console.error('API Error:', error);
  // Send to error tracking service
}
```

## Support

For issues or questions:
1. Check API_ENDPOINTS.md for endpoint details
2. Review UPGRADE_GUIDE.md for feature overview
3. Check browser console for frontend errors
4. Check server logs for backend errors
