import { registerAs } from "@nestjs/config";

export default registerAs("mongodb", () => ({
  url: process.env.MONGODB_URL,
  retryAttempts: process.env.MONGODB_RETRY_ATTEMPTS,
}));
