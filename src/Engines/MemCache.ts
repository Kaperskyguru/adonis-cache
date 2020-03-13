// const MemCache = use("MemCache");

class MemCache {
  private defaultMinutes = 60;

  constructor(config: any) {
    console.log(config);
  }
  public async get(name: String): Promise<any> {
    if (name) {
      // Implement Mem get here
      console.log(name);
      const value = "";
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
      console.log(name, data, duration);
      // Implement Set method
      //   data = JSON.stringify(data);
      //   if (duration == null) {
      //     return await this._addCache(name, data);
      //   }
      //   return await this._addExpiredCache(name, data, duration);
    }
  }

  public async delete(name: String): Promise<any> {
    // Implement Delete function
    console.log(name);
    return true;
  }
}
export default MemCache;
