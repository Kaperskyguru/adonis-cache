import CacheInterface from '../Contracts/CacheInterface'

class RedisCache implements CacheInterface {
	// private defaultMinutes = 60;
	private Redis: any

	constructor(app: any) {
		this.Redis = app.use('Adonis/Addons/Redis')
		if (this.Redis === null) throw new Error(`InvalidArgumentException: Adonis Redis not installed`)
	}

	public async get(name: string): Promise<any> {
		if (name) {
			// Implement Database get here
			const value = await this.Redis.get(name)
			if (value) {
				return this.deserialize(value)
			}
		}
	}

	public async set(name: string, data: any, duration: number): Promise<any> {
		if (name && data) {
			// Implement Set method
			data = this.serialize(data)
			if (duration) {
				return await this._addCache(name, data)
			}
			return await this._addExpiredCache(name, data, duration)
		}
	}

	public async delete(name: string): Promise<Boolean> {
		// Implement Delete function
		await this.Redis.del(name)
		return true
	}

	public async flush(): Promise<void> {
		await this.Redis.flushdb()
	}

	private async _addExpiredCache(name: string, data: any, duration: number): Promise<any> {
		let expiration = Math.floor(duration * 60)
		await this.Redis.set(name, data, 'EX', expiration)
		return data
	}

	private async _addCache(name: string, data: any): Promise<any> {
		await this.Redis.set(name, data)
		return data
	}

	private serialize(data: any): any {
		return JSON.stringify(data)
	}

	private deserialize(data: any): any {
		return JSON.parse(data)
	}
}
export default RedisCache
