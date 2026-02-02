# 🚀 Quick Start Guide - UniCollab v2.0

## Installation (2 minutes)

```bash
# 1. Install dependencies
npm run install-all

# 2. Install new backend packages
cd backend
npm install express-rate-limit joi

# 3. Start the app
cd ..
npm start
```

## New Features at a Glance

### 🤖 AI Recommendations
```javascript
// Frontend - Use recommendations
import { api } from '../services/api';

const recommendations = await api.get('/recommendations/for-you');
const trending = await api.get('/recommendations/trending');
```

### 🔒 Rate Limiting (Auto-enabled)
```javascript
// Already applied to all routes!
// Auth: 5 attempts/15min
// Create: 10 requests/min
// General: 100 requests/15min
```

### ✅ Input Validation (Auto-enabled)
```javascript
// Backend - Already applied to routes
// All inputs automatically validated
// Returns clear error messages
```

### ⚡ Caching
```javascript
// Backend - Use in routes
const { cache, cacheKeys } = require('../utils/cache');

router.get('/data', 
  cache.middleware(cacheKeys.projects, 300), // 5 min cache
  async (req, res) => {
    // Your handler
  }
);
```

### 📊 Analytics
```javascript
// Frontend - Track events
import { useAnalytics } from '../utils/analytics';

const { trackEvent, trackProjectView } = useAnalytics();

trackProjectView(projectId);
trackEvent('Category', 'Action', 'Label', value);
```

### 🛡️ Error Boundary (Auto-enabled)
```javascript
// Already wrapping your app!
// Catches all React errors gracefully
```

### 📱 PWA (Auto-enabled)
```javascript
// Service worker auto-registers in production
// Users can install app from browser
```

### 🔔 Notifications
```javascript
// Backend - Send notifications
const NotificationService = require('../services/notificationService');
const notificationService = new NotificationService(io);

await notificationService.notifyProjectJoin(ownerId, project, newMember);
```

## Quick Commands

```bash
# Development
npm run dev              # Start with nodemon

# Production
npm start               # Start production server

# Testing
npm test                # Run tests (when added)

# Database
npm run seed            # Seed database (if script exists)
```

## Environment Variables

```env
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/unicollab
JWT_SECRET=your_secret_key_here
PORT=3001
GA_TRACKING_ID=G-XXXXXXXXXX  # Optional

# Frontend (.env)
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_GA_ID=G-XXXXXXXXXX  # Optional
```

## New Routes

### Frontend
- `/recommendations` - AI-powered project suggestions
- All existing routes enhanced with analytics

### Backend API
- `GET /api/recommendations/for-you` - Personalized recommendations
- `GET /api/recommendations/trending` - Trending projects
- `GET /api/recommendations/similar/:id` - Similar projects

## Common Tasks

### Add Rate Limit to Route
```javascript
const { createLimiter } = require('../middleware/rateLimiter');

router.post('/endpoint', createLimiter, async (req, res) => {
  // Your handler
});
```

### Add Validation to Route
```javascript
const { validate, schemas } = require('../middleware/validator');

router.post('/endpoint', validate(schemas.createProject), async (req, res) => {
  // Your handler - req.body is validated
});
```

### Track Custom Event
```javascript
import analytics from '../utils/analytics';

analytics.event('Category', 'Action', 'Label', value);
```

### Clear Cache
```javascript
const { cache } = require('../utils/cache');

cache.clear(); // Clear all
cache.delete(key); // Clear specific
```

## Troubleshooting

### Rate Limited?
Wait for retry-after period or reduce request frequency

### Cache Issues?
```javascript
cache.clear(); // Backend
localStorage.clear(); // Frontend
```

### PWA Not Installing?
- Use HTTPS in production
- Check manifest.json is accessible
- Verify service worker registered

### Validation Errors?
Check error response for detailed field-level errors

## Performance Tips

1. **Use caching** for frequently accessed data
2. **Lazy load** non-critical components
3. **Optimize images** with OptimizedImage component
4. **Monitor** slow requests in backend logs
5. **Track** user behavior with analytics

## Security Checklist

- ✅ Rate limiting enabled
- ✅ Input validation active
- ✅ CORS configured
- ✅ JWT authentication
- ✅ Error messages sanitized
- ✅ HTTPS in production (required)

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment variables
3. ✅ Start the application
4. ✅ Test new features
5. ✅ Review TESTING_CHECKLIST.md
6. ✅ Deploy to production

## Documentation

- `EVALUATION_SUMMARY.md` - Complete overview
- `ENHANCEMENTS.md` - Detailed setup guide
- `TESTING_CHECKLIST.md` - Testing procedures
- `README.md` - Project documentation

## Support

- GitHub: [@Satyamkumar2610](https://github.com/Satyamkumar2610)
- Issues: [Create Issue](https://github.com/Satyamkumar2610/unicollab/issues)

---

**Version:** 2.0.0  
**Status:** ✅ Production Ready  
**Time to Deploy:** ~5 minutes
