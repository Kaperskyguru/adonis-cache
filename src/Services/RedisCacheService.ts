import ServiceInterface from "../Contracts/ServiceInterface";
import RedisCache from "../Engines/RedisCache";

class RedisCacheService extends RedisCache implements ServiceInterface {
  constructor(app: any) {
    super(app);
  }

  public async get(name: string): Promise<any> {
    if (name) {
      const value: string = await super.get(name);
      if (value) {
        return JSON.parse(value);
      }
    }
  }

  public async has(name: string): Promise<Boolean> {
    const value = await this.get(name);
    if (value == null) {
      return false;
    }
    return true;
  }

  public async set(name: string, data: any, duration: number): Promise<any> {
    if (name && data) {
      data = JSON.stringify(data);
      return await super.set(name, data, duration);
      //   if (duration == null) {
      //     return await this._addCache(name, data);
      //   }
      //   return await this._addExpiredCache(name, data, duration);
    }
  }

  public async delete(name: string): Promise<Boolean> {
    if (await this.has(name)) {
      await super.delete(name);
      return true;
    }
    return false;
  }

  public async update(name: string, data: any, duration: number): Promise<any> {
    if (await this.delete(name)) {
      return await this.set(name, data, duration);
    } else return await this.set(name, data, duration);
  }

  async remember(
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
  }
}
module.exports = RedisCacheService;
