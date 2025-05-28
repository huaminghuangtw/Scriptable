// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: magic;
// ================
// Tl;dr: This Cache class provides a robust solution for persistent, offline-safe data storage in Scriptable scripts.
//
// Explanation:
//
// iCloud Drive may offload files at any time to save space.
// When this happens, attempts to read those files can fail unless the device is *online* and able to *re-download* them.
// To prevent this, the class caches data in the Keychain — a secure and local storage mechanism exposed by Scriptable for saving small pieces of data such as strings, credentials, tokens, and settings.
//
// [Scriptable’s Keychain utility](https://docs.scriptable.app/keychain/) allows scripts to store and retrieve key-value pairs securely.
// Data saved in the Keychain persists across script executions and app restarts, is encrypted by the system, and is not affected by iCloud file offloading or network availability.
// This makes it ideal for storing fallback or critical data that needs to be accessible at all times.
//
// By leveraging the Keychain in this way, the Cache class ensures reliable access even if the original file is *offloaded* or the device is *offline*.
// ================
class Cache {
    /**
     * @param {string} fetchKey - The key to use for caching in Keychain.
     * @param {number} fetchIntervalInMinutes - Cache expiration interval in minutes. Default is 1440 (1 day).
     *        If set to 0, data is always refetched.
     */
    constructor(fetchKey, fetchIntervalInMinutes = 1440) {
        this.fetchKey = fetchKey;
        this.fetchIntervalInMinutes = fetchIntervalInMinutes;
    }

    /**
     * Retrieves the cached data from Keychain for this.fetchKey.
     * Returns the parsed object or null if not found or invalid.
     * Note: This does not check cache validity/expiry. Use isCacheValid() for that.
     */
    get() {
        try {
            return JSON.parse(Keychain.get(this.fetchKey));
        } catch {
            return null;
        }
    }

    /**
     * Stores data in Keychain with an expiry timestamp.
     * @param {any} data - The data to cache.
     */
    set(data) {
        const expire_at = new Date(
            Date.now() + this.fetchIntervalInMinutes * 60 * 1000
        );
        Keychain.set(this.fetchKey, JSON.stringify({ data, expiry_at: expire_at }));
    }

    /**
     * Checks if the cached data is still valid (not expired)
     * @param {Object} cachedData - The cached data object
     * @returns {boolean} True if cache is valid, false otherwise
     */
    isCacheValid(cachedData) {
        if (!cachedData || !cachedData.expiry_at) return false;
        return new Date(cachedData.expiry_at) > Date.now();
    }

    /**
     * Checks for internet connectivity by making a simple request.
     * @returns {Promise<boolean>} True if online, false otherwise
     */
    static async isConnectedToInternet() {
        try {
            await new Request("https://www.google.com").load();
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Fetches data with cache: tries cache first, then fetches and updates cache if needed.
     * @param {Function} fetchFn - async function to fetch data
     */
    async getOrFetch(fetchFn) {
        const cachedData = this.get();
        const hasValidCache =
            this.isCacheValid(cachedData) &&
            cachedData &&
            cachedData.data !== undefined;

        if (await Cache.isConnectedToInternet()) {
            if (hasValidCache) {
                return cachedData.data;
            } else {
                const data = await fetchFn();
                this.set(data);
                return data;
            }
        } else {
            return hasValidCache ? cachedData.data : null;
        }
    }
}

module.exports = Cache;
