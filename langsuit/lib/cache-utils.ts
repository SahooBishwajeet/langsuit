import redis from "./redis";

/**
 * Invalidates cache for a specific resource
 * @param type - The type of resource (e.g., 'courses', 'units', 'lessons')
 * @param id - Optional ID for specific resource
 */
export async function invalidateCache(type: string, id?: string | number) {
  try {
    // Get all keys matching the pattern
    const keys = await redis.keys(`${type}*`);
    
    // Delete all matching keys
    if (keys.length > 0) {
      await redis.del(...keys);
    }

    // If specific ID is provided, invalidate that specific key
    if (id) {
      const specificKey = `${type}:${id}`;
      await redis.del(specificKey);
    }
  } catch (error) {
    console.error(`Error invalidating cache for ${type}:`, error);
  }
}
