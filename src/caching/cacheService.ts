import { redis } from "../config/cacheConfig";
const jwtDecode = require("jwt-decode").jwtDecode;

interface RegistrationRequest {
  token: string;
}

const cachingService = {
  registerSessionToCache: async (sessionId: string, registrationRequest: RegistrationRequest): Promise<void> => {
    console.log(`Caching the userName to the cache with registrationRequest ${JSON.stringify(registrationRequest)}`);
    const decodedToken = jwtDecode(registrationRequest.token);
    if (decodedToken.sub) {
        await redis.set(decodedToken.sub, sessionId, { ex: 1200 }); // 1200 seconds TTL
      } else {
        console.error("Decoded token does not contain 'sub' field.");
      }
  },

  getSessionIdByUserEmail: async (email: string): Promise<string | null> => {
    return await redis.get<string>(email);
  }
};

export { cachingService };