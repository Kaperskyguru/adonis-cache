"use strict";

const { ServiceProvider } = require("@adonisjs/fold");

class CacheProvider extends ServiceProvider {
  register() {
    this.app.singleton("Kaperskyguru/Adonis-Cache", app => {
      const Config = app.use("Adonis/Src/Config");
      const CacheLoader = require("../src/CacheLoader");
      return new CacheLoader(Config);
    });

    this.app.alias("Kaperskyguru/Adonis-Cache", "Cache");
  }
}
module.exports = CacheProvider;
