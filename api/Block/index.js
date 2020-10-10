const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const colors = require('colors');

const { lastEditOperations, createOperation } = require('../Operations/utils');
const { collectionViewSet, collectionViewUpdate } = require('../CollectionView/utils');
const { collectionUpdate } = require('../Collection/utils');
const { blockUpdate, blockListRemove, blockSet, blockListAfter } = require('./utils');

const Transaction = require('../Transaction');
const Collection = require('../Collection');

const red = (msg) => console.log(colors.red.bold(msg));

class Block {
	static setStatic (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (Block[key] = value));
		return Block;
	}

	constructor (block_data) {
		this.block_data = block_data;
	}

	static saveToCache (recordMap) {
		Object.keys(Block.cache).forEach((key) => {
			if (recordMap[key])
				Object.entries(recordMap[key]).forEach(([ record_id, record_value ]) => {
					Block.cache[key].set(record_id, record_value.value);
				});
		});
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

	async deleteBlock () {
		const current_time = Date.now();
		const { data: res } = await axios.post(
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
		return new Promise((resolve) => setTimeout(() => resolve(res), Block.interval));
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
		if (!target) red(`The block could be a nested block, try passing nested: true to options`);
		return new Promise((resolve) =>
			setTimeout(() => resolve(target ? new Block(recordMap.block[block_id].value) : undefined), Block.interval)
		);
	}

	async transferBlock (new_parent_id) {
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

	async createContent (options = {}) {
		// ? User given after id as position
		if (this.block_data.type === 'page') {
			const { format = {}, properties = {}, type = 'page' } = options;
			const $content_id = uuidv4();
			const current_time = Date.now();
			if (this.block_data.collection_id)
				red(`The block is of collection_view_page and thus cannot contain a ${type} content`);
			else {
				try {
					return new Promise((resolve) =>
						setTimeout(async () => {
							await axios.post(
								'https://www.notion.so/api/v3/saveTransactions',
								Transaction.createTransaction([
									[
										blockUpdate($content_id, [], {
											id: $content_id,
											type,
											properties,
											format,
											created_time: current_time,
											last_edited_time: current_time
										}),
										blockUpdate($content_id, [], {
											parent_id: this.block_data.id,
											parent_table: 'block',
											alive: true
										}),
										blockListAfter(this.block_data.id, [ 'content' ], { after: '', id: $content_id }),
										...createOperation($content_id, Block.user_id),
										...lastEditOperations($content_id, Block.user_id)
									]
								]),
								Block.headers
							);
							const res = await axios.post(
								'https://www.notion.so/api/v3/getBacklinksForBlock',
								{
									blockId: $content_id
								},
								Block.headers
							);
							resolve(new Block(res.data.recordMap.block[$content_id].value));
						}, Block.interval)
					);
				} catch (err) {
					red(err.response.data);
				}
			}
		} else {
			red('The block must be of type page to create a content inside it');
			return undefined;
		}
	}

	async createCollectionViewContent (options = {}) {
		//? Returns collection_view and parent block
		const $collection_view_id = uuidv4();
		const $collection_id = uuidv4();
		const $view_id = uuidv4();
		const parent_id = this.block_data.id;
		const user_id = Block.user_id;
		const { type = 'table', name = 'Default view' } = options;
		try {
			await axios.post(
				'https://www.notion.so/api/v3/saveTransactions',
				Transaction.createTransaction([
					[
						blockUpdate($collection_view_id, [], {
							id: $collection_view_id,
							type: 'collection_view',
							collection_id: $collection_id,
							view_ids: [ $view_id ],
							properties: {},
							created_time: Date.now(),
							last_edited_time: Date.now()
						}),
						collectionViewUpdate($view_id, [], {
							id: $view_id,
							version: 0,
							type,
							name,
							format: {
								[`${type}_properties`]: [ { property: 'title', visible: true, width: 250 } ],
								[`${type}_wrap`]: true
							},
							query2: { aggregations: [ { property: 'title', aggregator: 'count' } ] },
							page_sort: [],
							parent_id: $collection_view_id,
							parent_table: 'block',
							alive: true
						}),
						collectionUpdate($collection_id, [], {
							id: $collection_id,
							schema: {
								title: { name: 'Name', type: 'title' }
							},
							format: {
								collection_page_properties: []
							},
							parent_id: $collection_view_id,
							parent_table: 'block',
							alive: true
						}),
						blockUpdate($collection_view_id, [], { parent_id: parent_id, parent_table: 'block', alive: true }),
						blockListAfter(parent_id, [ 'content' ], { after: '', id: $collection_view_id }),
						...createOperation($collection_view_id, user_id),
						...lastEditOperations($collection_view_id, user_id)
					]
				]),
				Block.headers
			);
		} catch (err) {
			red(err.response.data);
		}
	}

	async createLinkedDBContent (collection_id) {
		const $content_id = uuidv4();
		const $view_id = uuidv4();
		const current_time = Date.now();
		try {
			await axios.post(
				'https://www.notion.so/api/v3/saveTransactions',
				Transaction.createTransaction([
					[
						collectionViewSet($view_id, [], {
							id: $view_id,
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
							view_ids: [ $view_id ],
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
		} catch (err) {
			red(err.response.data);
		}
	}

	async updateProperties (properties) {
		const property_entries = Object.entries(properties);
		await axios.post(
			'https://www.notion.so/api/v3/saveTransactions',
			Transaction.createTransaction([
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
			Transaction.createTransaction([
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

	async createCollectionView (options) {
		if (this.block_data.collection_id) {
			const { type = 'table', name = 'Table View' } = options;
			const $view_id = uuidv4();
			await axios.post(
				'https://www.notion.so/api/v3/saveTransactions',
				Transaction.createTransaction([
					[
						collectionViewSet($view_id, [], {
							id: $view_id,
							version: 1,
							name,
							type,
							format: { [`${type}_properties`]: [] },
							parent_table: 'block',
							alive: true,
							parent_id: this.block_data.id
						}),
						blockListAfter(this.block_data.id, [ 'view_ids' ], { after: '', id: $view_id }),
						blockSet(this.block_data.id, [ 'last_edited_time' ], Date.now())
					]
				]),
				Block.headers
			);
		} else red(`This block is not collection type`);
	}

	async convertToCollectionViewPage (options = {}) {
		// ? Take schema, properties and aggregates as options
		const { type = 'table', name = 'Default view', collection_name = 'Default collection name', format = {} } = options;
		const $collection_id = uuidv4();
		const $collection_view_id = uuidv4();
		const current_time = Date.now();
		// ? Get the new collection data
		// ? Shcema = {name, type, visible, width}
		await axios.post(
			'https://www.notion.so/api/v3/saveTransactions',
			Transaction.createTransaction([
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
							[`${type}_properties`]: [ { property: 'title', visible: true, width: 250 } ],
							[`${type}_wrap`]: true
						},
						query2: { aggregations: [ { property: 'title', aggregator: 'count' } ] },
						page_sort: [],
						parent_id: this.block_data.id,
						parent_table: 'block',
						alive: true
					}),
					collectionUpdate($collection_id, [], {
						id: $collection_id,
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
					collectionUpdate($collection_id, [], { name: [ [ collection_name ] ], format }),
					blockSet(this.block_data.id, [ 'last_edited_time' ], current_time),
					blockSet(this.block_data.id, [ 'last_edited_time' ], Date.now())
				]
			]),
			Block.headers
		);
		return new Collection({ block_data: this.block_data });
	}

	async getCollectionViewPage () {
		// ? Return new CollectionViewPage passing parent block data and new block data
		if (!this.block_data.collection_id) {
			red(`The block is not a collection_view_page`);
			return undefined;
		} else {
			if (Block.cache.collection.has(this.block_data.collection_id))
				return new Collection({
					block_data: this.block_data,
					collection_data: Block.cache.collection.get(this.block_data.collection_id)
				});
			await this.loadUserChunk();

			return new Collection({
				block_data: this.block_data,
				collection_data: Block.cache.collection.get(this.block_data.collection_id)
			});
		}
	}
}

module.exports = Block;
