# UniCollab API Endpoints Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Projects

### List Projects
```
GET /projects?page=1&limit=10&search=&sortBy=createdAt&order=desc&status=&category=
```
**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `search` (string) - Search in title and description
- `sortBy` (string, default: createdAt) - Sort field
- `order` (string, default: desc) - Sort order (asc/desc)
- `status` (string) - Filter by status (planning/active/completed)
- `category` (string) - Filter by category

**Response:**
```json
{
  "data": [
    {
      "_id": "...",
      "title": "Web App",
      "description": "...",
      "owner": { "_id": "...", "name": "...", "email": "..." },
      "members": [...],
      "status": "active",
      "category": "web",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "metadata": {
    "totalCount": 50,
    "totalPages": 5,
    "currentPage": 1,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Get Project Details
```
GET /projects/:id
```

### Create Project
```
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Project",
  "description": "Project description",
  "category": "web",
  "status": "planning",
  "maxMembers": 5,
  "requiredSkills": ["React", "Node.js"],
  "deadline": "2024-12-31"
}
```

### Update Project
```
PUT /projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "active"
}
```

### Join Project
```
POST /projects/:id/join
Authorization: Bearer <token>
```

### Leave Project
```
POST /projects/:id/leave
Authorization: Bearer <token>
```

## Notifications

### List Notifications
```
GET /notifications?page=1&limit=10&read=
Authorization: Bearer <token>
```
**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `read` (boolean) - Filter by read status

**Response:**
```json
{
  "data": [
    {
      "_id": "...",
      "recipient": "...",
      "sender": { "_id": "...", "name": "...", "avatar": "..." },
      "type": "collaboration_request",
      "title": "New Collaboration Request",
      "message": "Someone requested to join your project",
      "read": false,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "metadata": { ... }
}
```

### Get Unread Count
```
GET /notifications/unread/count
Authorization: Bearer <token>
```

**Response:**
```json
{
  "unreadCount": 5
}
```

### Mark as Read
```
PUT /notifications/:id/read
Authorization: Bearer <token>
```

### Mark All as Read
```
PUT /notifications/read-all
Authorization: Bearer <token>
```

### Delete Notification
```
DELETE /notifications/:id
Authorization: Bearer <token>
```

## Collaboration Requests

### Create Request
```
POST /collaboration-requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "...",
  "message": "I want to join your project"
}
```

### List Requests
```
GET /collaboration-requests?page=1&limit=10&status=pending
Authorization: Bearer <token>
```
**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `status` (string) - Filter by status (pending/accepted/rejected)

### Accept Request
```
PUT /collaboration-requests/:id/accept
Authorization: Bearer <token>
```

### Reject Request
```
PUT /collaboration-requests/:id/reject
Authorization: Bearer <token>
```

## Teams

### Create Team
```
POST /teams
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Team Name",
  "description": "Team description",
  "university": "University Name",
  "major": "Computer Science"
}
```

### List Teams
```
GET /teams?page=1&limit=10&search=&sortBy=createdAt&order=desc
Authorization: Bearer <token>
```
**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `search` (string) - Search in name and description
- `sortBy` (string, default: createdAt)
- `order` (string, default: desc)

### Get Team Details
```
GET /teams/:id
Authorization: Bearer <token>
```

### Update Team
```
PUT /teams/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}
```

### Add Member
```
POST /teams/:id/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "..."
}
```

### Remove Member
```
DELETE /teams/:id/members/:userId
Authorization: Bearer <token>
```

### Delete Team
```
DELETE /teams/:id
Authorization: Bearer <token>
```

## Authentication

### Register
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "university": "MIT",
  "major": "Computer Science"
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized to perform this action"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Error details"
}
```

## Rate Limiting
Currently no rate limiting. Recommended for production:
- 100 requests per minute per IP
- 1000 requests per hour per user

## Pagination Best Practices
- Use `limit=10` for initial load
- Implement infinite scroll or "Load More" button
- Cache results to reduce API calls
- Use `hasNextPage` to determine if more data exists
