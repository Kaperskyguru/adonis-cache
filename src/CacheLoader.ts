const { Kache } = require("../src/Consumers/Kache");
const {
  DatabaseCacheService
} = require("../src/Services/DatabaseCacheService");
const { FileCacheService } = require("../src/Services/FileCacheService");
const { RedisCacheService } = require("../src/Services/RedisCacheService");
const { MemCacheService } = require("../src/Services/MemCacheService");

class CacheLoader {
  cacheDriver = "file";
  private config: any;
  constructor(Config) {
    this.config = Config.merge("cache", {
      cacheDriver: this.cacheDriver
    });
    this.initialize(this.config);
  }

  initialize(config) {
    switch (config.cacheDriver.toLowerCase()) {
      case "memcache":
        // Load MemCacheService
        new Kache(new MemCacheService(config));
        break;

      case "redis":
        // Load RedisCacheService
        new Kache(new RedisCacheService(config));
        break;

      case "database":
        // Load DatabaseCacheService
        new Kache(new DatabaseCacheService(config));
        break;

      default:
        // Load FileCacheService
        new Kache(new FileCacheService(config));
        break;
    }
  }
}

module.exports = CacheLoader;
