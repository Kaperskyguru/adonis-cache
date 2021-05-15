interface CacheInterface {
	get(name: String): Promise<any>
	set(name: String, data: any, duration: Number): Promise<any>
	delete(name: String): Promise<Boolean>
	flush(): Promise<void>
}
export default CacheInterface
