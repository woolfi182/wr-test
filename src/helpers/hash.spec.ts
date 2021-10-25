import { generateUniqueHash } from "./hash";

describe("Helpers", () => {
  describe("hash.js/generateUniqueHash", () => {
    it("should return same hash on same strings", async () => {
      const strToHash = "super test";
      const res1 = await generateUniqueHash(strToHash);
      const res2 = await generateUniqueHash(strToHash);

      expect(typeof res1).toBe("string");
      expect(typeof res2).toBe("string");
      expect(res1).toBe(res2);
    });
    it("should return different hash on different strings", async () => {
      const strToHash1 = "super test1";
      const strToHash2 = "super test2";
      const res1 = await generateUniqueHash(strToHash1);
      const res2 = await generateUniqueHash(strToHash2);

      expect(typeof res1).toBe("string");
      expect(typeof res2).toBe("string");
      expect(res1).not.toBe(res2);
    });
  });
});
