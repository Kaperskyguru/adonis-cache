const Cache = require('../src/Consumers/Cache')
const DatabaseCacheService = require('../src/Services/DatabaseCacheService')
const FileCacheService = require('../src/Services/FileCacheService')
const RedisCacheService = require('../src/Services/RedisCacheService')
const MemCacheService = require('../src/Services/MemCacheService')

class CacheLoader {
	private cacheDriver = 'redis'
	private app: any

	constructor(App: any) {
		this.app = App
		this._setConfig('driver', this.cacheDriver)
	}

	public createCache() {
		const driver: string = this._getConfig('driver')
		let cache: any
		switch (driver.toLowerCase()) {
			case 'memcache':
				// Load MemCacheService
				cache = new Cache(new MemCacheService(this.app))
				break

			case 'redis':
				// Load RedisCacheService
				cache = new Cache(new RedisCacheService(this.app))
				break

			case 'database':
				// Load DatabaseCacheService
				cache = new Cache(new DatabaseCacheService(this.app))
				break

			default:
				// Load FileCacheService
				cache = new Cache(new FileCacheService(this.app))
				break
		}
		return cache
	}

	private _getConfig(name: string): string {
		return this.app.container.use('Adonis/Core/Config').get(`cache.${name}`)
	}
	private _setConfig(name: string, value: any) {
		const config = this._getConfig(name)
		if (config) {
			return
		}
		this.app.container.use('Adonis/Core/Config').set(`cache.${name}`, value)
	}
}

module.exports = CacheLoader
