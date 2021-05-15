'use strict'

const path = require('path')

module.exports = async (cli) => {
	try {
		const inFile = path.join(__dirname, './config', 'Config.ts')
		const outFile = path.join(cli.helpers.configPath(), 'cache.js')
		await cli.copy(inFile, outFile)
		cli.command.completed('create', 'config/cache.js')
	} catch (error) {}
}
