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
  constructor(Config: any) {
    this.config = Config.merge("cache", {
      cacheDriver: this.cacheDriver
    });
    this.initialize(this.config);
  }

  initialize(config: any) {
    switch (config.cacheDriver.toLowerCase()) {
      case "memcache":
        // Load MemCacheService
        new Cache(new MemCacheService(config));
        break;

      case "redis":
        // Load RedisCacheService
        new Cache(new RedisCacheService(config));
        break;

      case "database":
        // Load DatabaseCacheService
        new Cache(new DatabaseCacheService(config));
        break;

      default:
        // Load FileCacheService
        new Cache(new FileCacheService(config));
        break;
    }
  }
}

module.exports = CacheLoader;
