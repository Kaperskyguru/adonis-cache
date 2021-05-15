import ServiceInterface from '../Contracts/ServiceInterface'
import DatabaseCache from '../Engines/DatabaseCache'

class DatabaseCacheService extends DatabaseCache implements ServiceInterface {
	constructor(config: any) {
		super(config)
	}

	public async get(name: String): Promise<any> {
		if (name) {
			const value: string = await super.get(name)
			if (value) {
				return JSON.parse(value)
			}
		}
	}

	public async has(name: String): Promise<Boolean> {
		const value = await this.get(name)
		if (value === null) {
			return false
		}
		return true
	}

	public async set(name: String, data: any, duration: Number): Promise<any> {
		if (name && data) {
			data = JSON.stringify(data)
			return await super.set(name, data, duration)
			//   if (duration == null) {
			//     return await this._addCache(name, data);
			//   }
			//   return await this._addExpiredCache(name, data, duration);
		}
	}

	public async delete(name: String): Promise<Boolean> {
		if (await this.has(name)) {
			await super.delete(name)
			return true
		}
		return false
	}

	public async update(name: String, data: any, duration: Number): Promise<any> {
		if (await this.delete(name)) {
			return await this.set(name, data, duration)
		} else return await this.set(name, data, duration)
	}

	public async remember(name: String, duration: Number, callback: Function): Promise<any> {
		if (await this.has(name)) {
			return await this.get(name)
		} else {
			const data = await callback()
			await this.set(name, data, duration)
			return data
		}
	}

	public async rememberForever(name: String, callback: Function): Promise<any> {
		if (await this.has(name)) {
			return await this.get(name)
		} else {
			const data = await callback()
			await this.set(name, data, 50000000000000)
			return data
		}
	}
}
module.exports = DatabaseCacheService
