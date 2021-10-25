import * as crypto from "crypto";

/**
 * Generate unique hash string from givven string
 *
 * @param chunk string to make hash from
 * @returns hash string
 */
export const generateUniqueHash = async (chunk: string): Promise<string> => {
  return crypto.createHash("sha512").update(chunk).digest("hex");
};
