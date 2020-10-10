const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const { lastEditOperations, createOperation } = require('../Operations/utils');

const { blockUpdate, blockListRemove, blockSet, blockListAfter } = require('./utils');

const Transaction = require('../Transaction');

const { red, yellow } = require('../../utils/logs');

class Block {
	constructor (block_data) {
		this.block_data = block_data;
	}

	static setStatic (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (Block[key] = value));
		return Block;
	}

	async loadUserChunk (limit = 10) {
		const res = await axios.post(
			'https://www.notion.so/api/v3/loadPageChunk',
			{
				pageId: this.block_data.id,
				limit,
				chunkNumber: 0
			},
			Block.headers
		);
		Block.saveToCache(res.data.recordMap);
		return res.data;
	}

	async duplicate () {
		const generated_table_id = uuidv4();

		await axios.post(
			'https://www.notion.so/api/v3/saveTransactions',
			Transaction.createTransaction([
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
		// ? Return New Block
	}

	static async get (block_id) {
		const cache_data = Block.cache.block.get(block_id);
		if (cache_data) return cache_data;
		const { data: { recordMap } } = await axios.post(
			'https://www.notion.so/api/v3/getBacklinksForBlock',
			{ blockId: block_id },
			Block.headers
		);
		Block.saveToCache(recordMap);
		const target = recordMap.block[block_id];
		if (!target) {
			yellow(`No block with the id ${block_id} exists`);
			return undefined;
		}
		return new Promise((resolve) =>
			setTimeout(() => {
				resolve(new Block(recordMap.block[block_id].value));
			}, Block.interval)
		);
	}

	async update (args) {
		// ? Handle when args does not have appropriate shape eg: when format is not given, use the current value
		await axios.post(
			'https://www.notion.so/api/v3/saveTransactions',
			Transaction.createTransaction([
				[
					...Object.entries(args.format).map(([ path, arg ]) => blockSet(this.block_data.id, [ 'format', path ], arg)),
					...Object.entries(args.properties).map(([ path, arg ]) =>
						blockSet(this.block_data.id, [ 'properties', path ], [ [ arg ] ])
					),
					blockSet(this.block_data.id, [ 'last_edited_time' ], Date.now())
				]
			]),
			Block.headers
		);
	}

	async delete () {
		let success = true;
		const current_time = Date.now();
		try {
			await axios.post(
				'https://www.notion.so/api/v3/saveTransactions',
				Transaction.createTransaction([
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
			success = true;
		} catch (err) {
			red(err.response.data);
			success = false;
		}

		return new Promise((resolve) => setTimeout(() => resolve(success), Block.interval));
	}

	async transfer (new_parent_id) {
		const current_time = Date.now();
		await axios.post(
			'https://www.notion.so/api/v3/saveTransactions',
			Transaction.createTransaction([
				[
					blockUpdate(this.block_data.id, [], { alive: false }),
					blockListRemove(this.block_data.parent_id, [ 'content' ], { id: this.block_data.id }),
					blockUpdate(this.block_data.id, [], { parent_id: new_parent_id, parent_table: 'block', alive: true }),
					blockListAfter(new_parent_id, [ 'content' ], { id: this.block_data.id }),
					blockUpdate(this.block_data.id, [], { permissions: null }),
					blockSet(this.block_data.id, [ 'last_edited_time' ], current_time),
					blockSet(this.block_data.parent_id, [ 'last_edited_time' ], current_time),
					blockSet(new_parent_id, [ 'last_edited_time' ], current_time)
				]
			]),
			opts
		);
	}
}

module.exports = Block;
