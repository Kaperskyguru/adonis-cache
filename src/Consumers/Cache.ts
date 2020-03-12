import CacheInterface from "../Contracts/CacheInterface";
import ServiceInterface from "../Contracts/ServiceInterface";

// @Implements<CacheInterface>()
class Cache implements CacheInterface {
  private CacheEngine: ServiceInterface;
  //   private defaultMinutes = 60;
  constructor(CacheEngine: ServiceInterface) {
    this.CacheEngine = CacheEngine;
  }

  public async get(name) {
    if (name) {
      const value = await this.CacheEngine.get(name);
      if (value) {
        return JSON.parse(value);
      }
    }
  }

  public async has(name) {
    const value = await this.CacheEngine.get(name);
    if (value == null) {
      return false;
    }
    return true;
  }

  public async set(name, data, duration) {
    if (name && data) {
      data = JSON.stringify(data);
      return await this.CacheEngine.set(name, data, duration);
      //   if (duration == null) {
      //     return await this._addCache(name, data);
      //   }
      //   return await this._addExpiredCache(name, data, duration);
    }
  }

  public async delete(name) {
    if (await this.has(name)) {
      await this.CacheEngine.delete(name);
      return true;
    }
  }

  public async update(name, data, duration) {
    if (await this.has(name)) {
      await this.delete(name);
      return await this.set(name, data, duration);
    } else return await this.set(name, data, duration);
  }

  async remember(name, duration, callback) {
    if (await this.has(name)) {
      return await this.get(name);
    } else {
      const data = await callback();
      await this.set(name, data, duration);
      return data;
    }
  }

  public async rememberForever(name, callback) {
    if (await this.has(name)) {
      return await this.get(name);
    } else {
      const data = await callback();
      await this.set(name, data, null);
      return data;
    }
  }

  //   async _addExpiredCache(name, data, duration) {
  //     await this.CacheEngine.set(name, data, "EX", duration);
  //     return data;
  //   }

  //   async _addCache(name, data) {
  //     await this.CacheEngine.set(name, data, duration);
  //     return data;
  //   }
}

export default Cache;
