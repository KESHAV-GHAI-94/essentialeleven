import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

export const redis = redisUrl 
  ? new Redis(redisUrl, {
      connectTimeout: 5000, // 5 seconds
      maxRetriesPerRequest: 1
    }) 
  : { 
      // Fallback for local development if REDIS_URL is not provided
      get: async () => null,
      set: async () => null,
      del: async () => null,
      on: () => {} 
    };

redis.on?.("error", (err) => {
  console.error("Redis Error:", err);
});
