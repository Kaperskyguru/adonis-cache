module.exports = {
	extends: ['plugin:adonis/typescriptPackage', 'prettier', 'prettier/@typescript-eslint'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		sourceType: 'module',
		tsconfigRootDir: '' + __dirname,
		project: ['./tsconfig.json'], // could be tsconfig.json too
	},
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': ['error'],
	},
}
