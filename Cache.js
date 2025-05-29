// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: magic;
// ================
class Cache {
    constructor(fetchKey) {
        this.fetchKey = fetchKey;
    }

    get() {
        return JSON.parse(Keychain.get(this.fetchKey))
    }

    set(data) {
        Keychain.set(this.fetchKey, JSON.stringify(data));
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
        if (await Cache.isConnectedToInternet()) {
            const newData = await fetchFn();
            this.set(newData);
            return newData;
        } else {
            const cachedData = this.get();
            return cachedData;
        }
    }
}

module.exports = Cache;
