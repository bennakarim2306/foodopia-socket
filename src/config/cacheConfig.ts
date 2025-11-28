import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || 'https://full-quagga-15038.upstash.io',
  token: process.env.UPSTASH_REDIS_TOKEN || '',
});

export { redis };
