const { Redis } = require("@adonisjs/redis");

class RedisCache {
  private defaultMinutes = 60;

  constructor(config) {
    if (!Redis) throw "Cannot find Redis driver";
  }

  public async get(name) {
    if (name) {
      // Implement Database get here
      const value = await Redis.get(name);
      if (value) {
        return JSON.parse(value);
      }
    }
  }

  public async set(name, data, duration = this.defaultMinutes) {
    if (name && data) {
      // Implement Set method
      data = JSON.stringify(data);
      if (duration == null) {
        return await this._addCache(name, data);
      }
      return await this._addExpiredCache(name, data, duration);
    }
  }

  public async delete(name) {
    // Implement Delete function
    await Redis.del(name);
    return true;
  }

  private async _addExpiredCache(name, data, duration) {
    await Redis.set(name, data, "EX", duration);
    return data;
  }

  private async _addCache(name, data) {
    await Redis.set(name, data);
    return data;
  }
}
module.exports = RedisCache;
