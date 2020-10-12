const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const Transaction = require('../Transaction');
const Page = require('../Page');

const { blockUpdate, blockSet } = require('../Block/utils');
const { spaceListBefore } = require('./utils');
const { lastEditOperations, createOperation } = require('../Operations/utils');

class Space {
	constructor (space_data) {
		this.space_data = space_data;
	}

	static setStatic (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (Space[key] = value));
		return Space;
	}

	static async get (space_id) {
		const { data: { recordMap } } = await axios.post('https://www.notion.so/api/v3/loadUserContent', {}, Space.headers);
		Space.saveToCache(recordMap);
		return new Space(recordMap.space[space_id].value);
	}

	async createPage (opts = {}) {
		const { properties = {}, format = {} } = opts;

		const $block_id = uuidv4();
		await axios.post(
			'https://www.notion.so/api/v3/saveTransactions',
			Transaction.createTransaction([
				[
					blockSet($block_id, [], { type: 'page', id: $block_id, version: 1 }),
					blockUpdate($block_id, [], { permissions: [ { type: 'space_permission', role: 'editor' } ] }),
					blockUpdate($block_id, [], {
						parent_id: this.space_data.id,
						parent_table: 'space',
						alive: true,
						properties,
						format
					}),
					spaceListBefore(this.space_data.id, [ 'pages' ], { id: $block_id }),
					...lastEditOperations($block_id, Space.user_id),
					...createOperation($block_id, Space.user_id)
				]
			]),
			Space.headers
		);

		const { data: { recordMap } } = await axios.post(
			'https://www.notion.so/api/v3/getBacklinksForBlock',
			{ blockId: $block_id },
			Space.headers
		);
		Space.saveToCache(recordMap);
		return new Page(recordMap.block[$block_id].value);
	}
}

module.exports = Space;
