import { webSocketCache as myCache } from "../config/cacheConfig";
const jwtDecode = require("jwt-decode").jwtDecode;

interface RegistrationRequest {
  token: string;
}

const cachingService = {
  registerSessionToCache: (sessionId: string, registrationRequest: RegistrationRequest): void => {
    console.log(`Caching the userName to the cache with registrationRequest ${JSON.stringify(registrationRequest)}`);
    const decodedToken = jwtDecode(registrationRequest.token);
    if (decodedToken.sub) {
        myCache.set(decodedToken.sub, sessionId);
      } else {
        console.error("Decoded token does not contain 'sub' field.");
      }
  },

  getSessionIdByUserEmail: (email: string): string | undefined => {
    return myCache.get(email);
  }
};

export { cachingService };