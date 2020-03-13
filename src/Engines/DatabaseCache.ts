// const DatabaseCache = use("DatabaseCache");

class DatabaseCache {
  private defaultMinutes = 60;

  constructor(config: any) {
    console.log(config);
  }
  public async get(name: String): Promise<any> {
    if (name) {
      // Implement Database get here
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
      // Implement Set method
      console.log(name, data, duration);
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
export default DatabaseCache;
