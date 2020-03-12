"use strict";

const { ServiceProvider } = require("@adonisjs/fold");

class CacheProvider extends ServiceProvider {
  register() {
    this.app.singleton("Kaperskyguru/Adonis-Cache", app => {
      const Config = app.use("Adonis/Src/Config");
      const Cache = require("../src/CacheLoader");
      return new Cache(Config);
    });

    this.app.alias("Adonis/Addons/Cache", "Cache");
  }
}
module.exports = CacheProvider;
