import redis from "./redis";

export async function getCachedResponse(
  key: string,
  fetcher: () => Promise<any>,
  ttl: number = 900,
) {
  try {
    // Check if cached data exists
    const cachedData = await redis.get(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // Fetch fresh data
    const data = await fetcher();

    // Store data in Redis for 15 minutes
    await redis.setex(key, ttl, JSON.stringify(data));

    return data;
  } catch (error) {
    console.error("Cache error:", error);
    return fetcher(); // Fallback to fetching directly if Redis fails
  }
}
