# ✅ Testing Checklist for UniCollab Enhancements

## Pre-Testing Setup

- [ ] Install backend dependencies: `cd backend && npm install`
- [ ] Install frontend dependencies: `cd frontend && npm install`
- [ ] Verify MongoDB connection
- [ ] Start backend server: `npm run dev`
- [ ] Start frontend: `npm start`

---

## 1. Error Boundary Testing 🛡️

### Test Cases
- [ ] Navigate to a non-existent route
- [ ] Trigger a component error (modify code temporarily)
- [ ] Verify error boundary catches and displays error page
- [ ] Click "Reload Page" button - should reload
- [ ] Click "Go Home" button - should navigate to home
- [ ] Check console for error logging

**Expected Result:** Graceful error page instead of white screen

---

## 2. Rate Limiting Testing 🔒

### Test Cases

#### General API Rate Limit (100 req/15min)
```bash
# Run this script to test
for i in {1..105}; do
  curl http://localhost:3001/api/projects
  echo "Request $i"
done
```
- [ ] First 100 requests succeed
- [ ] 101st request returns 429 status
- [ ] Response includes retry-after header

#### Auth Rate Limit (5 attempts/15min)
```bash
# Test login rate limit
for i in {1..6}; do
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
  echo "Attempt $i"
done
```
- [ ] First 5 attempts processed
- [ ] 6th attempt returns 429 status
- [ ] Error message mentions rate limit

**Expected Result:** Rate limiting prevents abuse

---

## 3. Input Validation Testing ✅

### Test Cases

#### Invalid Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "A",
    "email": "invalid-email",
    "password": "123",
    "university": "",
    "major": ""
  }'
```
- [ ] Returns 400 status
- [ ] Response includes validation errors
- [ ] Each field error is detailed

#### Invalid Project Creation
- [ ] Try creating project with title < 3 characters
- [ ] Try with description < 10 characters
- [ ] Try with invalid category
- [ ] Verify all return proper validation errors

**Expected Result:** Clear validation error messages

---

## 4. Recommendation Engine Testing 🤖

### Test Cases

#### Setup
- [ ] Create user with skills: ["React", "Node.js", "MongoDB"]
- [ ] Create projects with matching skills
- [ ] Create projects from same university

#### Test Recommendations
```bash
# Get personalized recommendations
curl http://localhost:3001/api/recommendations/for-you \
  -H "Authorization: Bearer YOUR_TOKEN"
```
- [ ] Returns projects matching user skills
- [ ] Shows match score percentage
- [ ] Prioritizes same university projects
- [ ] Excludes projects user already joined

#### Test Trending
```bash
curl http://localhost:3001/api/recommendations/trending
```
- [ ] Returns recently created projects
- [ ] Sorted by member count and recency
- [ ] Maximum 10 results

#### Test Similar Projects
```bash
curl http://localhost:3001/api/recommendations/similar/PROJECT_ID
```
- [ ] Returns projects in same category
- [ ] Returns projects with similar skills
- [ ] Maximum 5 results

**Expected Result:** Relevant, personalized recommendations

---

## 5. Caching Testing ⚡

### Test Cases

#### First Request (Cache Miss)
```bash
time curl http://localhost:3001/api/projects
```
- [ ] Note response time (e.g., 500ms)
- [ ] Check backend logs for database query

#### Second Request (Cache Hit)
```bash
time curl http://localhost:3001/api/projects
```
- [ ] Response time significantly faster (e.g., 50ms)
- [ ] No database query in logs
- [ ] Same data returned

#### Cache Invalidation
- [ ] Create new project
- [ ] Fetch projects list
- [ ] Verify new project appears (cache invalidated)

**Expected Result:** 70%+ faster response times

---

## 6. PWA Testing 📱

### Test Cases

#### Desktop (Chrome/Edge)
- [ ] Open app in Chrome
- [ ] Look for install icon in address bar
- [ ] Click install
- [ ] Verify app opens in standalone window
- [ ] Check app shortcuts work

#### Mobile (iOS Safari)
- [ ] Open app in Safari
- [ ] Tap Share button
- [ ] Select "Add to Home Screen"
- [ ] Verify icon appears on home screen
- [ ] Open app - should feel native

#### Offline Support
- [ ] Open app online
- [ ] Open DevTools > Network
- [ ] Set to "Offline"
- [ ] Navigate between pages
- [ ] Verify cached pages load
- [ ] Try API call - should show offline message

#### Service Worker
- [ ] Open DevTools > Application > Service Workers
- [ ] Verify service worker is registered
- [ ] Check Cache Storage for cached files

**Expected Result:** App works offline, installable

---

## 7. Analytics Testing 📊

### Test Cases

#### Setup
- [ ] Add Google Analytics ID to .env
- [ ] Verify gtag script loads in browser

#### Page Views
- [ ] Navigate to different pages
- [ ] Open browser console
- [ ] Verify page view events logged
- [ ] Check Google Analytics Real-Time reports

#### Custom Events
- [ ] View a project
- [ ] Create a project
- [ ] Join a project
- [ ] Search for projects
- [ ] Verify events in console (dev mode)
- [ ] Check Google Analytics Events report

**Expected Result:** All user actions tracked

---

## 8. Performance Monitoring Testing 📈

### Test Cases

#### Backend Monitoring
- [ ] Make API requests
- [ ] Check backend console logs
- [ ] Verify request duration logged
- [ ] Slow requests (>1s) show warning

#### Frontend Performance
- [ ] Open DevTools > Performance
- [ ] Record page load
- [ ] Verify lazy loading works
- [ ] Check image loading is optimized
- [ ] Verify no layout shifts

**Expected Result:** Performance metrics logged

---

## 9. Enhanced Notifications Testing 🔔

### Test Cases

#### Real-time Notifications
- [ ] Open app in two browser windows
- [ ] Login as different users
- [ ] User A joins User B's project
- [ ] Verify User B receives real-time notification
- [ ] Check notification appears without refresh

#### Notification Types
- [ ] Test project invite notification
- [ ] Test new member notification
- [ ] Test project update notification
- [ ] Verify each has correct icon and message

#### Notification Actions
- [ ] Mark single notification as read
- [ ] Mark all as read
- [ ] Delete notification
- [ ] Click notification - navigates to correct page

**Expected Result:** Real-time, actionable notifications

---

## 10. Integration Testing 🔗

### Test Complete User Flow

#### New User Journey
- [ ] Register new account (validation works)
- [ ] Complete profile with skills
- [ ] Visit recommendations page
- [ ] See personalized suggestions
- [ ] Join a recommended project
- [ ] Receive notification
- [ ] View project workspace
- [ ] All actions tracked in analytics

#### Project Owner Journey
- [ ] Create new project (validation works)
- [ ] Project appears in recommendations
- [ ] Another user joins
- [ ] Receive real-time notification
- [ ] View project members
- [ ] Update project (cache invalidated)

**Expected Result:** Seamless end-to-end experience

---

## 11. Security Testing 🔐

### Test Cases

#### SQL Injection Attempts
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com OR 1=1--","password":"test"}'
```
- [ ] Request rejected or sanitized
- [ ] No database error exposed

#### XSS Attempts
- [ ] Try creating project with `<script>alert('xss')</script>` in title
- [ ] Verify script doesn't execute
- [ ] Content is escaped/sanitized

#### CSRF Protection
- [ ] Verify CORS headers are set
- [ ] Only allowed origins can access API

**Expected Result:** All attacks prevented

---

## 12. Load Testing 🏋️

### Test Cases

#### Concurrent Users
```bash
# Use Apache Bench or similar
ab -n 1000 -c 10 http://localhost:3001/api/projects
```
- [ ] Server handles concurrent requests
- [ ] No crashes or errors
- [ ] Response times remain acceptable
- [ ] Rate limiting kicks in appropriately

**Expected Result:** Stable under load

---

## Performance Benchmarks

### Target Metrics
- [ ] API response time < 200ms (cached)
- [ ] API response time < 500ms (uncached)
- [ ] Page load time < 2s
- [ ] Time to interactive < 3s
- [ ] First contentful paint < 1s
- [ ] Lighthouse score > 90

---

## Browser Compatibility

### Test in Multiple Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Accessibility Testing ♿

### Test Cases
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG standards
- [ ] Focus indicators visible
- [ ] Alt text on images

---

## Final Checklist

### Before Production Deployment
- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables set
- [ ] Database indexes created
- [ ] SSL certificate configured
- [ ] Analytics configured
- [ ] Error tracking configured
- [ ] Backup strategy in place
- [ ] Monitoring alerts set up
- [ ] Documentation updated

---

## Bug Reporting Template

If you find issues:

```markdown
**Bug Title:** [Brief description]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Environment:**
- Browser: 
- OS: 
- Node version: 
- MongoDB version: 

**Screenshots/Logs:**
[Attach if applicable]
```

---

## Success Criteria

✅ All critical tests passing  
✅ No security vulnerabilities  
✅ Performance targets met  
✅ PWA installable  
✅ Analytics tracking  
✅ Error handling working  
✅ Rate limiting active  
✅ Recommendations accurate  

---

**Testing Version:** 2.0.0  
**Last Updated:** 2024  
**Status:** Ready for Testing
