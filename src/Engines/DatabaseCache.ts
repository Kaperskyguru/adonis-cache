// const DatabaseCache = use("DatabaseCache");

class DatabaseCache {
  private defaultMinutes = 60;

  constructor(config) {}
  public async get(name) {
    if (name) {
      // Implement Database get here
      const value = "";
      if (value) {
        return JSON.parse(value);
      }
    }
  }

  public async set(name, data, duration = this.defaultMinutes) {
    if (name && data) {
      // Implement Set method
      //   data = JSON.stringify(data);
      //   if (duration == null) {
      //     return await this._addCache(name, data);
      //   }
      //   return await this._addExpiredCache(name, data, duration);
    }
  }

  public async delete(name) {
    // Implement Delete function

    return true;
  }
}
export default DatabaseCache;
