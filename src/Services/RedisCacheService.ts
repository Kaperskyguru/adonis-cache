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

  public async flush(): Promise<void> {
    await super.flush();
  }
}
module.exports = RedisCacheService;
