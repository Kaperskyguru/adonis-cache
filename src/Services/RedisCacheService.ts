import ServiceInterface from '../Contracts/ServiceInterface'
import RedisCache from '../Engines/RedisCache'

class RedisCacheService extends RedisCache implements ServiceInterface {
	constructor(app: any) {
		super(app)
	}

	public async get(name: string): Promise<any> {
		if (name) {
			const value: string = await super.get(name)
			if (value) {
				return this.deserialize(value)
			}
		}
	}

	public async has(name: string): Promise<Boolean> {
		const value = await this.get(name)
		return !value
	}

	public async set(name: string, data: any, duration: number = 0): Promise<any> {
		if (name && data) {
			return await super.set(name, this.serialize(data), duration)
		}
	}

	public async delete(name: string): Promise<Boolean> {
		return await super.delete(name)
	}

	public async update(name: string, data: any, duration: number): Promise<any> {
		if (await this.delete(name)) {
			return await this.set(name, data, duration)
		} else return await this.set(name, data, duration)
	}

	public async flush(): Promise<void> {
		await super.flush()
	}

	private serialize(data: any): any {
		return JSON.stringify(data)
	}

	private deserialize(data: any): any {
		return JSON.parse(data)
	}
}
module.exports = RedisCacheService
