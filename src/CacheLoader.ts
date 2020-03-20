const { Cache } = require("../src/Consumers/Cache");
const {
  DatabaseCacheService
} = require("../src/Services/DatabaseCacheService");
const { FileCacheService } = require("../src/Services/FileCacheService");
const { RedisCacheService } = require("../src/Services/RedisCacheService");
const { MemCacheService } = require("../src/Services/MemCacheService");

class CacheLoader {
  cacheDriver = "file";
  private config: any;
  private app: any;

  constructor(App: any) {
    this.app = App;
    this.config = App.config.merge("cache", {
      cacheDriver: this.cacheDriver
    });
    this.initialize(this.config);
  }

  initialize(config: any) {
    switch (config.cacheDriver.toLowerCase()) {
      case "memcache":
        // Load MemCacheService
        new Cache(new MemCacheService(this.app));
        break;

      case "redis":
        console.log(this.app, config);
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
