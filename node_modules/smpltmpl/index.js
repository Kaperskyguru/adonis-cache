// @ts-check
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const codeFrame = require('babel-code-frame');

const STACK_REGEXP = /evalmachine\.<anonymous>:(\d+)(?::(\d+))?\n/;
const STACK_REGEXP_ALL = new RegExp(STACK_REGEXP.source, 'g');

/**
 * @param {string} filename
 * @return {string}
 */
function read(filename) {
	try {
		return fs.readFileSync(filename, 'utf8');
	} catch (err) {
		if (err.code === 'ENOENT') {
			throw Error(`Template file not found: ${filename}`);
		} else {
			throw err;
		}
	}
}

/**
 * @param {string} source
 * @param {Error} exception
 * @param {string} filename
 * @return {string}
 */
function getErrorMessage(source, exception, filename) {
	// Take line and column from the last mentioned position which would look like this:
	// evalmachine.<anonymous>:1:11
	const positions = exception.stack.match(STACK_REGEXP_ALL);
	const position = [filename];
	let line;
	let col;
	if (positions) {
		const m = positions.pop().match(STACK_REGEXP);
		if (m) {
			line = m[1];
			position.push(line);
			col = m[2];
			if (col) {
				position.push(col);
			}
		}
	}

	const code = line ? codeFrame(source, Number(line), Number(col || 1)) : source;

	return `Error in template ${position.join(':')}\n${exception.message}\n\n${code}`;
}

/**
 * @param {string} tmpl
 * @param {object} context
 * @param {string} [filename]
 * @return {string}
 */
function template(tmpl, context, filename) {
	filename = filename || 'untitled';
	tmpl = tmpl.replace(/`/g, '\\`');
	try {
		return vm.runInNewContext('`' + tmpl + '`', context);
	} catch (exception) {
		throw new Error(getErrorMessage(tmpl, exception, filename));
	}
}

/**
 * @param {string} filename
 * @param {string} context
 * @return {string}
 */
function templateFromFile(filename, context) {
	const tmpl = read(filename);
	return template(tmpl, context, path.basename(filename));
}

module.exports = {
	template,
	templateFromFile,
};
