/*
 * @kaperskyguru/adonis-cache
 *
 * (c) Solomon Eseme <kaperskyguru@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Env from '@ioc:Adonis/Core/Env'
import { CacheConfig } from '@ioc:Kaperskyguru/Adonis-Cache'

const cacheConfig: CacheConfig = {
	driver: Env.get('CACHE_DRIVER') as string,

	drivers: {
		file: {
			driver: 'file',
			path: 'cache/data',
		},

		array: {
			driver: 'array',
			serialize: false,
		},

		database: {
			driver: 'database',
			table: 'cache',
			connection: null,
			lock_connection: null,
		},

		redis: {
			driver: 'redis',
			connection: 'cache',
			lock_connection: 'default',
		},

		memcached: {
			driver: Env.get('CACHE_DRIVER', 'memcached') as string,
			persistent_id: Env.get('MEMCACHED_PERSISTENT_ID') as string,
			sasl: [Env.get('MEMCACHED_USERNAME') as string, Env.get('MEMCACHED_PASSWORD') as string],
			options: {
				// Memcached::OPT_CONNECT_TIMEOUT : 2000,
			},
			servers: {
				host: Env.get('MEMCACHED_HOST', '127.0.0.1') as string,
				port: Env.get('MEMCACHED_PORT', 11211) as string,
				weight: 100,
			},
		},
	},
}

export default cacheConfig
