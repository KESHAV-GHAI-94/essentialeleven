import { Redis } from "@upstash/redis";

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = (upstashUrl && upstashToken)
  ? new Redis({
      url: upstashUrl,
      token: upstashToken,
    })
  : {
      get: async () => null,
      set: async () => null,
      incr: async () => 0,
      expire: async () => true,
    };
