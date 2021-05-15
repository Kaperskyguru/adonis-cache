## Register provider

```js
const providers = ['@adonisjs/cache/providers/CacheProvider']
```

Inside your Controllers

```js
const Cache = use('Cache')
```

```javascript
const Cache = use('Cache')

Cache.get('posts').then((post) => {
	res.json(post)
})
```
