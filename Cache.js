// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: magic;
const CACHE_REGISTRY_KEY = "__cache_registry__";

class Cache {
  constructor(fetchKey, cacheExpiresInMinutes = 1440) {
    this.fetchKey = fetchKey;
    this.cacheExpiresInMinutes = cacheExpiresInMinutes;
  }

  get() {
    const raw = Keychain.get(this.fetchKey);
    return raw ? JSON.parse(raw) : null;
  }

  set(data) {
    const expire_at = new Date(
      Date.now() + this.cacheExpiresInMinutes * 60 * 1000,
    );
    Keychain.set(this.fetchKey, JSON.stringify({ data, expire_at }));
    this._register();
  }

  remove() {
    if (Keychain.contains(this.fetchKey)) Keychain.remove(this.fetchKey);
    this._deregister();
  }

  isExpired() {
    const cacheObj = Keychain.contains(this.fetchKey) ? this.get() : null;
    return !cacheObj || new Date(cacheObj.expire_at) <= Date.now();
  }

  _register() {
    const registry = Cache._getRegistry();
    if (!registry.includes(this.fetchKey)) {
      registry.push(this.fetchKey);
      Cache._setRegistry(registry);
    }
  }

  _deregister() {
    const registry = Cache._getRegistry().filter((k) => k !== this.fetchKey);
    Cache._setRegistry(registry);
  }

  static _getRegistry() {
    return Keychain.contains(CACHE_REGISTRY_KEY)
      ? JSON.parse(Keychain.get(CACHE_REGISTRY_KEY))
      : [];
  }

  static _setRegistry(registry) {
    Keychain.set(CACHE_REGISTRY_KEY, JSON.stringify(registry));
  }

  static _formatCountdown(expire_at) {
    const diff = new Date(expire_at) - Date.now();
    const abs = Math.abs(diff);
    const m = Math.floor(abs / 60000) % 60;
    const h = Math.floor(abs / 3600000) % 24;
    const d = Math.floor(abs / 86400000);
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0 || parts.length === 0) parts.push(`${m}m`);
    return diff < 0
      ? `expired ${parts.join(" ")} ago`
      : `in ${parts.join(" ")}`;
  }

  static async removeAll() {
    const registry = Cache._getRegistry();
    for (const key of registry) {
      if (Keychain.contains(key)) Keychain.remove(key);
    }
    Cache._setRegistry([]);
  }

  static async showAll() {
    const keys = Cache._getRegistry();

    if (keys.length === 0) {
      const a = new Alert();
      a.title = "Cached Keys";
      a.message = "No cached data found.";
      a.addCancelAction("OK");
      await a.present();
      return {};
    }

    const now = Date.now();
    const summary = {};
    for (const key of keys) {
      if (!Keychain.contains(key)) continue;
      try {
        const { expire_at } = JSON.parse(Keychain.get(key));
        const expired = new Date(expire_at) <= now;
        summary[key] = { expire_at: expire_at ?? "unknown", expired };
      } catch {
        summary[key] = { expire_at: "unreadable", expired: null };
      }
    }

    const table = new UITable();
    table.showSeparators = true;

    const header = new UITableRow();
    header.isHeader = true;
    const headerCell = header.addText(`Cached Keys (${keys.length})`);
    headerCell.titleFont = Font.boldSystemFont(16);
    table.addRow(header);

    for (const [key, { expire_at, expired }] of Object.entries(summary)) {
      const row = new UITableRow();
      row.height = 60;
      const nameCell = row.addText(key, expired ? "⚠️ expired" : "✅ valid");
      nameCell.titleFont = Font.systemFont(14);
      nameCell.subtitleFont = Font.systemFont(11);
      const expCell = row.addText(Cache._formatCountdown(expire_at));
      expCell.titleFont = Font.systemFont(12);
      expCell.rightAligned();
      table.addRow(row);
    }

    const clearRow = new UITableRow();
    clearRow.height = 50;
    const clearCell = clearRow.addText("🗑 Clear All Cache");
    clearCell.titleColor = Color.red();
    clearCell.titleFont = Font.boldSystemFont(14);
    clearRow.onSelect = async () => {
      const confirm = new Alert();
      confirm.title = "Clear All Cache";
      confirm.message = `Remove all ${keys.length} cached key(s)?`;
      confirm.addDestructiveAction("Clear");
      confirm.addCancelAction("Cancel");
      if ((await confirm.present()) === 0) await Cache.removeAll();
    };
    table.addRow(clearRow);

    await table.present();

    return summary;
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
    const cacheObj = Keychain.contains(this.fetchKey) ? this.get() : null;

    if (cacheObj && !this.isExpired()) {
      this._register();
      return cacheObj.data;
    }

    if (await Cache.isConnectedToInternet()) {
      try {
        const newData = await fetchFn();
        this.set(newData);
        return newData;
      } catch (e) {
        if (cacheObj) return cacheObj.data;
        throw e;
      }
    }

    if (cacheObj) return cacheObj.data;
    throw Error("No cached data & no internet connection.");
  }
}

module.exports = Cache;

if (Script.name() === "Cache") {
  (async () => {
    await Cache.showAll();
  })();
}
