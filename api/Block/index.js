const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const Transaction = require('./transaction');
const { lastEditOperations, createOperation } = require('./operations');
const { blockUpdate, blockListRemove, blockSet, blockListAfter } = require('./utils');

class Block {
	static setStatic (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (Block[key] = value));
		return Block;
	}

	static createBlock (block_id) {
		return block_id;
	}

	constructor (block_data) {
		this.block_data = block_data;
	}

	get Transaction () {
		return Transaction.setStatic({
			shardId: this.block_data.shard_id,
			spaceId: this.block_data.space_id
		});
	}

	async deleteBlock () {
		const current_time = Date.now();
		const { data: res } = await axios.post(
			'https://www.notion.so/api/v3/saveTransactions',
			this.Transaction.createTransaction([
				[
					blockUpdate(this.block_data.id, [], {
						alive: false
					}),
					blockListRemove(this.block_data.this.block_data.id, [ 'content' ], { id: this.block_data.id }),
					blockSet(this.block_data.id, [ 'last_edited_time' ], current_time),
					blockSet(this.block_data.this.block_data.id, [ 'last_edited_time' ], current_time)
				]
			]),
			Block.headers
		);

		Block.cache.block.delete(this.block_data.id);
		return new Promise((resolve) => setTimeout(() => resolve(res), this.interval));
	}

	static async getBlock (block_id, options = {}) {
		const { nested = false } = options;
		if (Block.cache.block.has(block_id)) return Block.cache.block.get(block_id);
		const url = nested
			? 'https://www.notion.so/api/v3/getBacklinksForBlock'
			: 'https://www.notion.so/api/v3/loadUserContent';
		const data = nested ? { blockId: block_id } : {};

		const { data: { recordMap } } = await axios.post(url, data, Block.headers);
		Block.saveToCache(recordMap);
		const target = recordMap.block[block_id];
		return new Promise((resolve) =>
			setTimeout(() => resolve(target ? new Block(recordMap.block[block_id].value) : undefined), Block.interval)
		);
	}

	static saveToCache (recordMap) {
		Object.entries(Block.cache).forEach(([ key, map ]) => {
			if (recordMap[key])
				Object.entries(recordMap[key]).forEach(([ record_id, record_value ]) => {
					Block.cache[key].set(record_id, record_value.value);
				});
		});
	}

	async createChild (options = {}) {
		const { type = 'page', title = '' } = options;
		const generated_block_id = uuidv4();
		const random_id = '1ae68749-5579-43b2-b283-e4ced43859ec';
		const current_time = Date.now();

		await axios.post(
			'https://www.notion.so/api/v3/saveTransactions',
			this.Transaction.createTransaction([
				[ blockSet(random_id, [ 'properties', 'title' ], []) ],
				[
					blockUpdate(generated_block_id, [], {
						id: generated_block_id,
						type,
						properties: {
							title: [ [ title ] ]
						},
						created_time: current_time,
						last_edited_time: current_time
					}),
					blockUpdate(generated_block_id, [], { parent_id: this.block_data.id, parent_table: 'block', alive: true }),
					blockListAfter(this.block_data.id, [ 'content' ], { after: random_id, id: generated_block_id }),
					blockUpdate(random_id, [], { alive: false }),
					blockListRemove(this.block_data.id, [ 'content' ], { id: random_id }),
					...createOperation(generated_block_id, Block.user_id),
					...lastEditOperations(generated_block_id, Block.user_id)
				]
			]),
			Block.headers
		);
	}

	async updateProperties (properties) {
		const property_entries = Object.entries(properties);
		await axios.post(
			'https://www.notion.so/api/v3/saveTransactions',
			this.Transaction.createTransaction([
				[
					...property_entries.map(([ path, arg ]) => blockSet(this.block_data.id, [ 'properties', path ], [ [ arg ] ])),
					blockSet(this.block_data.id, [ 'last_edited_time' ], Date.now())
				]
			]),
			Block.headers
		);
	}

	async updateFormat (formats) {
		const format_entries = Object.entries(formats);
		await axios.post(
			'https://www.notion.so/api/v3/saveTransactions',
			this.Transaction.createTransaction([
				[
					...format_entries.map(([ path, arg ]) => blockSet(this.block_data.id, [ 'format', path ], arg)),
					blockSet(this.block_data.id, [ 'last_edited_time' ], Date.now())
				]
			]),
			Block.headers
		);
	}

	async duplicateBlock () {
		const generated_table_id = uuidv4();

		await axios.post(
			'https://www.notion.so/api/v3/saveTransactions',
			this.Transaction.createTransaction([
				[
					blockSet(generated_table_id, [], {
						type: 'copy_indicator',
						id: generated_table_id,
						version: 1
					}),
					blockUpdate(generated_table_id, [], {
						parent_id: this.block_data.parent_id,
						parent_table: 'block',
						alive: true
					}),
					blockListAfter(this.block_data.parent_id, [ 'content' ], {
						after: this.block_data.id,
						id: generated_table_id
					}),
					...lastEditOperations(generated_table_id, Block.user_id),
					...createOperation(generated_table_id, Block.user_id)
				]
			]),
			Block.headers
		);

		await axios.post(
			'https://www.notion.so/api/v3/enqueueTask',
			{
				task: {
					eventName: 'duplicateBlock',
					request: {
						sourceBlockId: this.block_data.id,
						targetBlockId: generated_table_id,
						addCopyName: true
					}
				}
			},
			Block.headers
		);
	}
}

module.exports = Block;
