import EngineInterface from '../Contracts/EngineInterface'
const fs = require('fs')
const sha256 = require('crypto-js/sha256')

// const FileCache = use("FileCache");

class FileCache implements EngineInterface {
	private fileConfig: any
	private app: any

	constructor(app: any) {
		this.app = app
		try {
			this.fileConfig = app.container.use('Adonis/Core/Config').get('cache').drivers.file
			if (!this.fileConfig) {
				throw new Error('File driver configuration not found')
			}
			this.init()
		} catch (error) {
			throw new Error(error)
		}
	}

	private async init() {
		!fs.existsSync(this.app.tmpPath(this.fileConfig.path)) &&
			fs.mkdirSync(this.app.tmpPath(this.fileConfig.path), { recursive: true })
	}

	private path() {
		return this.app.tmpPath(this.fileConfig.path)
	}

	private ensureCacheDirectoryExists(path: string) {
		!fs.existsSync(path) && fs.mkdirSync(path, { recursive: true })
	}

	private write(key: string, data: any) {
		this.ensureCacheDirectoryExists(this.path())
		fs.writeFileSync(this.path() + '/' + this.hashKey(key), data, 'binary')
	}

	private read(key: string) {
		return fs.readFileSync(this.path() + '/' + this.hashKey(key), 'binary')
	}

	public async get(name: string): Promise<any> {
		if (this.isCacheExist(name)) {
			return this.read(name)
		}
	}

	public async set(name: string, data: any, duration: Number): Promise<any> {
		if (!name) {
			throw new Error('')
		}

		if (!data) {
			throw new Error('')
		}

		console.log(duration)

		return this.write(name, data)

		// Implement Set method
		//   data = JSON.stringify(data);
		//   if (duration == null) {
		//     return await this._addCache(name, data);
		//   }
		//   return await this._addExpiredCache(name, data, duration);
	}

	public async flush(): Promise<void> {
		throw new Error('Method not implemented.')
	}

	public async delete(name: String): Promise<any> {
		// Implement Delete function
		console.log(name)
		return true
	}

	private hashKey(key: string) {
		return sha256(key) + ''
	}

	private async isCacheExist(key: string): Promise<Boolean> {
		const path = this.path()
		return fs.existsSync(path + '/' + this.hashKey(key))
	}
}
export default FileCache
