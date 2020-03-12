import ServiceInterface from "../Contracts/ServiceInterface";
import MemCache from "../Engines/MemCache";

class MemCacheService extends MemCache implements ServiceInterface {
  constructor(config) {
    super(config);
  }

  public async get(name) {
    if (name) {
      const value = await super.get(name);
      if (value) {
        return JSON.parse(value);
      }
    }
  }

  public async has(name) {
    const value = await this.get(name);
    if (value == null) {
      return false;
    }
    return true;
  }

  public async set(name, data, duration) {
    if (name && data) {
      data = JSON.stringify(data);
      return super.set(name, data, duration);
      //   if (duration == null) {
      //     return await this._addCache(name, data);
      //   }
      //   return await this._addExpiredCache(name, data, duration);
    }
  }

  public async delete(name) {
    if (await this.has(name)) {
      await super.delete(name);
      return true;
    }
    return false;
  }

  public async update(name, data, duration) {
    if (await this.delete(name)) {
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
  //     await this.set(name, data, "EX", duration);
  //     return data;
  //   }

  //   async _addCache(name, data) {
  //     await this.set(name, data);
  //     return data;
  //   }
}
export default MemCacheService;
