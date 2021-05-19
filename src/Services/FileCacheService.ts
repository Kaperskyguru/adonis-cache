import ServiceInterface from '../Contracts/ServiceInterface'
import FileCache from '../Engines/FileCache'

class FileCacheService extends FileCache implements ServiceInterface {
	constructor(app: any) {
		super(app)
	}

	public async get(name: string): Promise<any> {
		if (name) {
			const value = await super.get(name)
			if (value) {
				return this.deserialize(value)
			}
			return null
		}
	}

	public async has(name: string): Promise<Boolean> {
		const value = await this.get(name)
		return !!value
	}

	public async set(name: string, data: any, duration: number = 0): Promise<any> {
		if (name && data) {
			return await super.set(name, this.serialize(data), duration)
		}
	}

	public async delete(name: string): Promise<Boolean> {
		if (await this.has(name)) {
			await super.delete(name)
			return true
		}
		return false
	}

	public async flush(): Promise<void> {
		return await super.flush()
	}

	public async update(name: string, data: any, duration: number): Promise<any> {
		if (await this.delete(name)) {
			return await this.set(name, data, duration)
		} else return await this.set(name, data, duration)
	}

	private serialize(data: any): any {
		return JSON.stringify(data)
	}

	private deserialize(data: any): any {
		return JSON.parse(data)
	}
}
module.exports = FileCacheService
