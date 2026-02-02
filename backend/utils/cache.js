class CacheManager {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map();
  }

  set(key, value, ttlSeconds = 300) {
    this.cache.set(key, value);
    this.ttl.set(key, Date.now() + ttlSeconds * 1000);
    
    // Auto cleanup
    setTimeout(() => this.delete(key), ttlSeconds * 1000);
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    
    const expiry = this.ttl.get(key);
    if (expiry && Date.now() > expiry) {
      this.delete(key);
      return null;
    }
    
    return this.cache.get(key);
  }

  delete(key) {
    this.cache.delete(key);
    this.ttl.delete(key);
  }

  clear() {
    this.cache.clear();
    this.ttl.clear();
  }

  has(key) {
    const value = this.get(key);
    return value !== null;
  }

  // Cache middleware
  middleware(keyGenerator, ttl = 300) {
    return async (req, res, next) => {
      const key = keyGenerator(req);
      const cached = this.get(key);
      
      if (cached) {
        return res.json(cached);
      }

      // Store original json method
      const originalJson = res.json.bind(res);
      
      // Override json method to cache response
      res.json = (data) => {
        this.set(key, data, ttl);
        return originalJson(data);
      };

      next();
    };
  }
}

const cache = new CacheManager();

// Helper to generate cache keys
const cacheKeys = {
  projects: (req) => `projects:${JSON.stringify(req.query)}`,
  project: (req) => `project:${req.params.id}`,
  user: (req) => `user:${req.params.id}`,
  recommendations: (req) => `recommendations:${req.user.userId}`,
  trending: () => `trending:${new Date().toDateString()}`
};

module.exports = { cache, cacheKeys };
