import Cache from "../src/Consumers/Cache";
import DatabaseCacheService from "../src/Services/DatabaseCacheService";
import FileCacheService from "../src/Services/FileCacheService";
import RedisCacheService from "../src/Services/RedisCacheService";
import MemCacheService from "../src/Services/MemCacheService";

class CacheLoader {
  cacheDriver = "file";
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
