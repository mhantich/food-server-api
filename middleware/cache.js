const redis = require('../utils/redis');

// Cache middleware
const cache = (duration) => {
  return async (req, res, next) => {
    const key = req.originalUrl;
    
    try {
      const cachedData = await redis.get(key);
      
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }
      
      // Modify res.json to store the response in cache
      const originalJson = res.json;
      res.json = function(data) {
        redis.setex(key, duration, JSON.stringify(data));
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache error:', error);
      next();
    }
  };
};

module.exports = cache;