"use strict";

import { IocContract } from "@adonisjs/fold";

export class CacheProvider {
  constructor(protected $container: IocContract) {}

  register() {
    this.$container.singleton("Kaperskyguru/Adonis-Cache", () => {
      const Config = this.$container.use("Adonis/Src/Config");
      const CacheLoader = require("../src/CacheLoader");
      return new CacheLoader(Config);
    });

    this.$container.alias("Kaperskyguru/Adonis-Cache", "Cache");
  }
}
