import EngineInterface from '../Contracts/EngineInterface'

// const MemCache = use("MemCache");

class MemCache implements EngineInterface {
	private defaultMinutes = 60

	constructor(app: any) {
		console.log(app)
	}
	public async get(name: string): Promise<any> {
		if (name) {
			// Implement Mem get here
			console.log(name)
			const value = ''
			if (value) {
				return JSON.parse(value)
			}
		}
	}

	public async set(name: string, data: any, duration: number = this.defaultMinutes): Promise<any> {
		if (name && data) {
			console.log(name, data, duration)
			// Implement Set method
			//   data = JSON.stringify(data);
			//   if (duration == null) {
			//     return await this._addCache(name, data);
			//   }
			//   return await this._addExpiredCache(name, data, duration);
		}
	}

	public async flush(): Promise<void> {
		throw new Error('Method not implemented.')
	}

	public async delete(name: string): Promise<any> {
		// Implement Delete function
		console.log(name)
		return true
	}
}
export default MemCache
