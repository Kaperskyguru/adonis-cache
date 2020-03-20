class RedisCache {
  private defaultMinutes = 60;
  private Redis: any;
  constructor(app: any) {
    const { Redis } = app.use("Adonis/Addons/Redis");
    console.log(app);
    if (!Redis) throw "Cannot find Redis driver";
  }

  public async get(name: String): Promise<any> {
    if (name) {
      // Implement Database get here
      const value = await this.Redis.get(name);
      if (value) {
        return JSON.parse(value);
      }
    }
  }

  public async set(
    name: String,
    data: any,
    duration: Number = this.defaultMinutes
  ): Promise<any> {
    if (name && data) {
      // Implement Set method
      data = JSON.stringify(data);
      if (duration == null) {
        return await this._addCache(name, data);
      }
      return await this._addExpiredCache(name, data, duration);
    }
  }

  public async delete(name: String): Promise<Boolean> {
    // Implement Delete function
    await this.Redis.del(name);
    return true;
  }

  private async _addExpiredCache(
    name: String,
    data: any,
    duration: Number
  ): Promise<any> {
    await this.Redis.set(name, data, "EX", duration);
    return data;
  }

  private async _addCache(name: String, data: any): Promise<any> {
    await this.Redis.set(name, data);
    return data;
  }
}
export default RedisCache;
