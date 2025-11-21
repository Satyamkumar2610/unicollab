# UniCollab Platform Upgrade Guide

## Overview
This upgrade transforms UniCollab into a full-stack platform with advanced backend features including pagination, search, sorting, filtering, notifications, collaboration requests, and team management.

## Backend Enhancements

### New Models
1. **Notification** (`backend/models/notification.js`)
   - Tracks user notifications for collaboration requests, project updates, member joins/leaves
   - Fields: recipient, sender, type, title, message, relatedProject, relatedRequest, read, actionUrl

2. **CollaborationRequest** (`backend/models/collaborationRequest.js`)
   - Manages join requests for projects
   - Fields: project, requester, status (pending/accepted/rejected), message, respondedAt, respondedBy

3. **Team** (`backend/models/team.js`)
   - Groups users for collaborative work
   - Fields: name, description, leader, members, projects, university, major, avatar

### New Routes

#### Notifications (`/api/notifications`)
- `GET /` - List notifications with pagination and read filter
- `GET /unread/count` - Get unread notification count
- `PUT /:id/read` - Mark notification as read
- `PUT /read-all` - Mark all notifications as read
- `DELETE /:id` - Delete notification

#### Collaboration Requests (`/api/collaboration-requests`)
- `POST /` - Create collaboration request
- `GET /` - List requests for user's projects
- `PUT /:id/accept` - Accept collaboration request
- `PUT /:id/reject` - Reject collaboration request

#### Teams (`/api/teams`)
- `POST /` - Create team
- `GET /` - List teams with search, sort, pagination
- `GET /:id` - Get team details
- `PUT /:id` - Update team
- `POST /:id/members` - Add member to team
- `DELETE /:id/members/:userId` - Remove member from team
- `DELETE /:id` - Delete team

#### Enhanced Projects (`/api/projects`)
- `GET /` - List with pagination, search, sort, filters (status, category)
- Query params: `page`, `limit`, `search`, `sortBy`, `order`, `status`, `category`

### Response Format
All list endpoints return consistent metadata:
```json
{
  "data": [...],
  "metadata": {
    "totalCount": 100,
    "totalPages": 10,
    "currentPage": 1,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Frontend Enhancements

### New Hooks
1. **usePagination** - Manages pagination state (page, limit, navigation)
2. **useList** - Handles data fetching with loading, error, and metadata states

### New Components
1. **LoadingState** - Spinner and skeleton loaders
2. **ErrorState** - Error display with retry button
3. **EmptyState** - Empty list message
4. **Pagination** - Navigation between pages
5. **ListFilters** - Search, sort, and filter controls

### New Pages
1. **Notifications** (`/notifications`) - View and manage notifications
2. **Explore** (`/explore`) - Browse and join projects with advanced filters
3. **Teams** (`/teams`) - Create and manage teams

### Utilities
1. **queryBuilder** - Build query parameters for API calls
2. **useList hook** - Fetch and manage list data

## Installation & Setup

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## API Integration Examples

### Fetch Projects with Pagination
```javascript
const response = await api.get('/projects?page=1&limit=10&search=web&sortBy=createdAt&order=desc&status=active');
// Returns: { data: [...], metadata: {...} }
```

### Create Collaboration Request
```javascript
const response = await api.post('/collaboration-requests', {
  projectId: '123',
  message: 'I want to join your project'
});
```

### List Notifications
```javascript
const response = await api.get('/notifications?page=1&limit=10&read=false');
```

## Frontend Usage Examples

### Using useList Hook
```javascript
const { data, metadata, loading, error, refetch } = useList(
  () => api.get('/projects?page=1&limit=10'),
  [page, limit]
);
```

### Using Pagination
```javascript
<Pagination metadata={metadata} onPageChange={goToPage} />
```

### Using Filters
```javascript
<ListFilters
  onSearch={handleSearch}
  onSort={handleSort}
  onFilter={handleFilter}
  filters={{ status: true, category: true }}
/>
```

## Database Schema Updates

### User Model (existing)
- Add `avatar` field for profile pictures

### Project Model (existing)
- Add `category` field for filtering

## Future Recommendations

### Phase 2 Features
1. **Real-time Notifications** - WebSocket integration for live updates
2. **Chat System** - Direct messaging between team members
3. **File Sharing** - Upload and share project files
4. **Activity Feed** - Track project activities and milestones
5. **Advanced Search** - Elasticsearch integration for better search

### Performance Optimizations
1. **Caching** - Redis for frequently accessed data
2. **Database Indexing** - Index search and filter fields
3. **Pagination Optimization** - Cursor-based pagination for large datasets
4. **Image Optimization** - CDN for avatar and project images

### Security Enhancements
1. **Rate Limiting** - Prevent API abuse
2. **Input Validation** - Sanitize all user inputs
3. **CORS Configuration** - Restrict API access
4. **JWT Refresh Tokens** - Implement token rotation

### Scalability
1. **Microservices** - Separate services for notifications, teams, projects
2. **Message Queue** - RabbitMQ/Kafka for async operations
3. **Load Balancing** - Distribute traffic across multiple servers
4. **Database Replication** - MongoDB replica sets

## Deployment Checklist

- [ ] Update environment variables (.env files)
- [ ] Run database migrations
- [ ] Test all API endpoints
- [ ] Verify pagination and filtering
- [ ] Test authentication flows
- [ ] Load test the application
- [ ] Set up monitoring and logging
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Set up automated backups

## Troubleshooting

### Common Issues

**Pagination not working**
- Ensure `page` and `limit` query parameters are numbers
- Check metadata is being returned from API

**Filters not applying**
- Verify filter values match database field values
- Check query parameters are being sent correctly

**Notifications not appearing**
- Ensure notifications are being created when events occur
- Check recipient user ID is correct

**Team creation failing**
- Verify user is authenticated
- Check all required fields are provided

## Support & Documentation

For detailed API documentation, see `API_ENDPOINTS.md`
For frontend component documentation, see `FRONTEND_COMPONENTS.md`
