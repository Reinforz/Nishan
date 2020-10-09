const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const Transaction = require('./transaction');
const { lastEditOperations, createOperation } = require('./operations');
const { blockUpdate, blockListRemove, blockSet, blockListAfter } = require('./utils');

const { collectionViewSet, collectionViewUpdate } = require('../CollectionView/utils');
const { collectionUpdate } = require('../Collection/utils');

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

	async createPageContent (options = {}) {
		const { title = '' } = options;
		const generated_block_id = uuidv4();
		const current_time = Date.now();
		try {
			await axios.post(
				'https://www.notion.so/api/v3/saveTransactions',
				this.Transaction.createTransaction([
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
						blockListAfter(this.block_data.id, [ 'content' ], { after: '', id: generated_block_id }),
						...createOperation(generated_block_id, Block.user_id),
						...lastEditOperations(generated_block_id, Block.user_id)
					]
				]),
				Block.headers
			);
		} catch (err) {
			console.log(err.response.data.message);
		}
	}

	async createLinkedDBContent (collection_id) {
		const $content_id = uuidv4();
		const $collection_view_id = uuidv4();
		const current_time = Date.now();

		await axios.post(
			'https://www.notion.so/api/v3/saveTransactions',
			this.Transaction.createTransaction([
				[
					collectionViewSet($collection_view_id, [], {
						id: $collection_view_id,
						version: 1,
						type: 'table',
						parent_id: $content_id,
						parent_table: 'block',
						alive: true
					}),
					blockSet($content_id, [], {
						id: $content_id,
						version: 1,
						type: 'collection_view',
						collection_id,
						view_ids: [ $collection_view_id ],
						parent_id: this.block_data.id,
						parent_table: 'block',
						alive: true,
						created_by_table: 'notion_user',
						created_by_id: Block.user_id,
						created_time: current_time,
						last_edited_by_table: 'notion_user',
						last_edited_by_id: Block.user_id,
						last_edited_time: current_time
					}),
					blockListAfter(this.block_data.id, [ 'content' ], { after: '', id: $content_id }),
					blockSet($content_id, [ 'last_edited_time' ], current_time)
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

	async convertToFullPage (options) {
		const { type = 'table', name = 'Default view', collection_name = 'Default collection name', format = {} } = options;
		const $collection_id = uuidv4();
		const $collection_view_id = uuidv4();
		const current_time = Date.now();

		await axios.post(
			'https://www.notion.so/api/v3/saveTransactions',
			this.Transaction.createTransaction([
				[
					blockUpdate(this.block_data.id, [], {
						id: this.block_data.id,
						type: 'collection_view_page',
						collection_id: $collection_id,
						view_ids: [ $collection_view_id ],
						properties: {},
						created_time: current_time,
						last_edited_time: current_time
					}),
					collectionViewUpdate($collection_view_id, [], {
						id: $collection_view_id,
						version: 0,
						type,
						name,
						format: {
							table_properties: [ { property: 'title', visible: true, width: 250 } ],
							table_wrap: true
						},
						query2: { aggregations: [ { property: 'title', aggregator: 'count' } ] },
						page_sort: [],
						parent_id: this.block_data.id,
						parent_table: 'block',
						alive: true
					}),
					collectionUpdate($collection_id, [], {
						id: '4d397df7-6664-49a4-a1cd-0feddf234154',
						schema: {
							title: { name: 'Name', type: 'title' }
						},
						format: {
							collection_page_properties: []
						},
						parent_id: this.block_data.id,
						parent_table: 'block',
						alive: true
					}),
					blockSet(this.block_data.id, [ 'last_edited_time' ], current_time),
					collectionUpdate($collection_id, [], { name: [ [ collection_name ] ], format }),
					blockSet(this.block_data.id, [ 'last_edited_time' ], Date.now())
				]
			]),
			Block.headers
		);
	}
}

module.exports = Block;
