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

	private init() {
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

		fs.writeFileSync(this.path() + '/' + '_' + this.hashKey(key), data, 'binary')
	}

	private writeWithTime(key: string, data: any, duration: number) {
		this.ensureCacheDirectoryExists(this.path())
		const currentDate = new Date()
		const futureDate = new Date(currentDate.getTime() + duration * 60000)
		const expiresIn = futureDate.getTime()
		// Append Timestamp to the data

		const newArr = {}

		newArr['meta'] = { expiresIn }
		newArr['data'] = data

		fs.writeFileSync(
			this.path() + '/' + this.hashKey(key) + '.cache',
			JSON.stringify(newArr),
			'binary',
		)
	}

	private read(key: string): any {
		const data = JSON.parse(
			fs.readFileSync(this.path() + '/' + this.hashKey(key) + '.cache', 'binary'),
		)

		if (data['meta']) {
			const time = new Date(data['meta']['expiresIn']).getTime()
			if (time < new Date().getTime()) {
				return this.deleteFIle(key)
			}
		}
		return JSON.stringify(data['data'])
	}

	public async get(name: string): Promise<any> {
		if (await this.isCacheExist(name)) {
			const data = this.read(name)
			if (typeof data === 'boolean') {
				return null
			}
			return data
		}
		return null
	}

	public async set(name: string, data: any, duration: number): Promise<any> {
		if (!name) {
			throw new Error('Cache key not provided')
		}

		if (!data) {
			throw new Error('Cache data not provided')
		}

		if (duration !== 0) {
			return this.writeWithTime(name, data, duration)
		}

		return this.write(name, data)
	}

	public async flush(): Promise<void> {
		fs.rmdirSync(this.path(), { recursive: true })
	}

	public async delete(key: string): Promise<Boolean> {
		return this.deleteFIle(key)
	}

	private hashKey(key: string) {
		return sha256(key) + ''
	}

	private async isCacheExist(key: string): Promise<Boolean> {
		const path = this.path()
		return fs.existsSync(path + '/' + this.hashKey(key) +  '.cache')
	}

	private deleteFIle(key: string): Boolean {
		try {
			if (this.isCacheExist(key)) {
				const path = this.path()
				fs.unlinkSync(path + '/' + this.hashKey(key))
				return true
			}
			return false
		} catch (e) {
			return false
		}
	}
}
export default FileCache
