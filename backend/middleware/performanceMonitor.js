const performanceMonitor = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;
    
    const logData = {
      method,
      url: originalUrl,
      status: statusCode,
      duration: `${duration}ms`,
      ip: ip || req.headers['x-forwarded-for'],
      timestamp: new Date().toISOString()
    };

    if (duration > 1000) {
      console.warn('⚠️  SLOW REQUEST:', logData);
    } else if (process.env.NODE_ENV === 'development') {
      console.log('📊', logData);
    }

    if (global.analytics) {
      global.analytics.trackTiming('API', originalUrl, duration);
    }
  });

  next();
};

module.exports = performanceMonitor;
