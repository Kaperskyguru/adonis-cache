import CacheInterface from "../Contracts/CacheInterface";
import ServiceInterface from "../Contracts/ServiceInterface";

// @Implements<CacheInterface>()
class Cache implements CacheInterface {
  private CacheEngine: ServiceInterface;
  constructor(CacheEngine: ServiceInterface) {
    this.CacheEngine = CacheEngine;
  }

  public async get(name: String): Promise<any> {
    if (name) {
      const value = await this.CacheEngine.get(name);
      if (value) {
        return JSON.parse(value);
      }
    }
  }

  public async has(name: String): Promise<Boolean> {
    const value = await this.CacheEngine.get(name);
    if (value == null) {
      return false;
    }
    return true;
  }

  public async set(name: String, data: any, duration: Number): Promise<any> {
    if (name && data) {
      data = JSON.stringify(data);
      return await this.CacheEngine.set(name, data, duration);
    }
  }

  public async delete(name: String): Promise<Boolean> {
    if (await this.has(name)) {
      await this.CacheEngine.delete(name);
      return true;
    }
    return false;
  }

  public async update(name: String, data: any, duration: Number): Promise<any> {
    if (await this.has(name)) {
      await this.delete(name);
      return await this.set(name, data, duration);
    } else return await this.set(name, data, duration);
  }

  async remember(
    name: String,
    duration: Number,
    callback: Function
  ): Promise<any> {
    if (await this.has(name)) {
      return await this.get(name);
    } else {
      const data = await callback();
      await this.set(name, data, duration);
      return data;
    }
  }

  public async rememberForever(name: String, callback: Function): Promise<any> {
    if (await this.has(name)) {
      return await this.get(name);
    } else {
      const data = await callback();
      await this.set(name, data, 5888888888888);
      return data;
    }
  }
}

module.exports = Cache;
