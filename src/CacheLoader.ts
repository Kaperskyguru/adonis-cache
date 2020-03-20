const Cache = require("../src/Consumers/Cache");
const DatabaseCacheService = require("../src/Services/DatabaseCacheService");
const FileCacheService = require("../src/Services/FileCacheService");
const RedisCacheService = require("../src/Services/RedisCacheService");
const MemCacheService = require("../src/Services/MemCacheService");

class CacheLoader {
  cacheDriver = "redis";
  private app: any;

  constructor(App: any) {
    this.app = App;
    this._setConfig("driver", this.cacheDriver);
    this.initialize(this._getConfig("driver"));
  }
  _getConfig(name: String) {
    return this.app.use("Adonis/Src/Config").get(`cache.${name}`);
  }
  _setConfig(name: String, value: any) {
    const config = this._getConfig(name);
    if (config) {
      return;
    }
    this.app.use("Adonis/Src/Config").set(`cache.${name}`, value);
  }
  initialize(driver: String) {
    switch (driver.toLowerCase()) {
      case "memcache":
        // Load MemCacheService
        new Cache(new MemCacheService(this.app));
        break;

      case "redis":
        // Load RedisCacheService
        new Cache(new RedisCacheService(this.app));
        break;

      case "database":
        // Load DatabaseCacheService
        new Cache(new DatabaseCacheService(this.app));
        break;

      default:
        // Load FileCacheService
        new Cache(new FileCacheService(this.app));
        break;
    }
  }
}

module.exports = CacheLoader;
