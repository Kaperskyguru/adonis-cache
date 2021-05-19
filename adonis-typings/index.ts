/*
 * @Kaperskyguru/adonis-cache
 *
 * (c) Solomon Eseme <kaperskyguru@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Kaperskyguru/Adonis-Cache' {
	/**
	 * Shape of adonis-cache config.
	 */
	export interface CacheConfig {
		driver: string
		drivers: object
	}

	export interface CacheInteface {
		get(name: string): Promise<any>
		set(name: string, data: any, duration: number): Promise<any>
		forever(name: string, data: any): Promise<any>
		update(name: string, data: any, duration?: number): Promise<any>
		delete(name: string): Promise<Boolean>
		remember(name: string, minutes: number, callback: Function): Promise<any>
		rememberForever(name: string, callback: Function): Promise<any>
		many(keys: Array<string>): Promise<object>
		setMany(data: object, minutes: number): Promise<any>
		flush(): Promise<void>
	}
	const Cache: CacheInteface
	export default Cache
}
