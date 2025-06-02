// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: magic;
class Cache {
    constructor(fetchKey, cacheExpiresInMinutes = 1440) {
        this.fetchKey = fetchKey;
        this.cacheExpiresInMinutes = cacheExpiresInMinutes;
    }

    get() {
        const cacheObj = Keychain.get(this.fetchKey);
        if (cacheObj) {
            return JSON.parse(cacheObj);
        } else {
            return null;
        }
    }

    set(data) {
        const expires_at = new Date(
            Date.now() + this.cacheExpiresInMinutes * 60 * 1000
        );
        Keychain.set(this.fetchKey, JSON.stringify({ data, expire_at: expires_at }));
    }

    contains(key) {
        return Keychain.contains(key);
    }

    isCacheValid(cachedData) {
        return new Date(cachedData.expire_at) > Date.now();
    }

    static async isConnectedToInternet() {
        try {
            await new Request("https://www.google.com").load();
            return true;
        } catch {
            return false;
        }
    }

    async getOrFetch(fetchFn) {
        const hasCache = this.contains(this.fetchKey);
        let cacheObj = hasCache ? this.get() : null;
        const isCacheValid = cacheObj && this.isCacheValid(cacheObj);
        if (isCacheValid) return cacheObj.data;

        const canFetch = await Cache.isConnectedToInternet();
        if (canFetch) {
            try {
                const newData = await fetchFn();
                this.set(newData);
                return newData;
            } catch (e) {
                if (cacheObj) return cacheObj.data;
                throw e;
            }
        } else {
            if (cacheObj) return cacheObj.data;
            throw Error("No cached data & internet connection.");
        }
    }
}

module.exports = Cache;