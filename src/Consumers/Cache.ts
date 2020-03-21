import ServiceInterface from "../Contracts/ServiceInterface";

// @Implements<CacheInterface>()
class Cache {
  private CacheService: ServiceInterface;
  constructor(cacheService: ServiceInterface) {
    this.CacheService = cacheService;
  }

  public async get(name: string): Promise<any> {
    if (name) {
      return await this.CacheService.get(name);
    }
  }

  public async has(name: string): Promise<Boolean> {
    const value = await this.CacheService.get(name);
    if (value == null) {
      return false;
    }
    return true;
  }

  public async set(name: string, data: any, duration: number): Promise<any> {
    if (name && data) {
      return await this.CacheService.set(name, data, duration);
    }
  }

  public async delete(name: string): Promise<Boolean> {
    if (await this.has(name)) {
      await this.CacheService.delete(name);
      return true;
    }
    return false;
  }

  public async update(name: string, data: any, duration: number): Promise<any> {
    if (await this.has(name)) {
      await this.delete(name);
      return await this.set(name, data, duration);
    } else return await this.set(name, data, duration);
  }

  public async remember(
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

  public async rememberForever(name: string, callback: Function): Promise<any> {
    if (await this.has(name)) {
      return await this.get(name);
    } else {
      const data = await callback();
      await this.set(name, data, 0);
      return data;
    }
  }

  public async many(keys: Array<string>): Promise<object> {
    let values = Promise.all(keys.map((key: string) => this.get(key)));
    let mappedValues: object = {};
    for (let index: number = 0; index < keys.length; index++) {
      mappedValues[keys[index]] = values[index];
    }
    return mappedValues;
  }

  public async setMany(data: object, minutes: number) {
    for (let prop in data) {
      await this.set(prop, data[prop], minutes);
    }
    return;
  }
}

module.exports = Cache;
