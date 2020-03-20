import ServiceInterface from "../Contracts/ServiceInterface";

// @Implements<CacheInterface>()
class Cache {
  private static CacheService: ServiceInterface;
  constructor(cacheService: ServiceInterface) {
    Cache.CacheService = cacheService;
  }

  public static async get(name: String): Promise<any> {
    if (name) {
      const value = await this.CacheService.get(name);
      if (value) {
        return JSON.parse(value);
      }
    }
  }

  public static async has(name: String): Promise<Boolean> {
    const value = await this.CacheService.get(name);
    if (value == null) {
      return false;
    }
    return true;
  }

  public static async set(
    name: String,
    data: any,
    duration: Number
  ): Promise<any> {
    if (name && data) {
      data = JSON.stringify(data);
      return await this.CacheService.set(name, data, duration);
    }
  }

  public static async delete(name: String): Promise<Boolean> {
    if (await this.has(name)) {
      await this.CacheService.delete(name);
      return true;
    }
    return false;
  }

  public static async update(
    name: String,
    data: any,
    duration: number
  ): Promise<any> {
    if (await this.has(name)) {
      await this.delete(name);
      return await this.set(name, data, duration);
    } else return await this.set(name, data, duration);
  }

  public static async remember(
    name: string,
    duration: number,
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

  public static async rememberForever(
    name: string,
    callback: Function
  ): Promise<any> {
    if (await this.has(name)) {
      return await this.get(name);
    } else {
      const data = await callback();
      await this.set(name, data, 0);
      return data;
    }
  }

  public static async many(keys: Array<string>): Promise<object> {
    let values = Promise.all(keys.map((key: string) => this.get(key)));
    let mappedValues: object = {};
    for (let index: number = 0; index < keys.length; index++) {
      mappedValues[keys[index]] = values[index];
    }
    return mappedValues;
  }

  public static async setMany(data: object, minutes: number) {
    for (let prop in data) {
      await this.set(prop, data[prop], minutes);
    }
    return;
  }
}

module.exports = Cache;
