const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const Block = require('../Block');
const CollectionViewPage = require('../CollectionViewPage');
const CollectionView = require('../CollectionView');
const Transaction = require('../Transaction');

const { lastEditOperations, createOperation } = require('../Operations/utils');
const { collectionViewSet, collectionViewUpdate } = require('../CollectionView/utils');
const { collectionUpdate } = require('../Collection/utils');
const { blockUpdate, blockSet, blockListAfter } = require('../Block/utils');

const { error, warn } = require('../../utils/logs');

class Page extends Block {
	constructor (block_data) {
		super(block_data);
		if (block_data.type !== 'page') throw new Error(error(`Cannot create page block from ${block_data.type} block`));
	}

	static setStatic (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (Page[key] = value));
		return Page;
	}

	static async get (arg) {
		if (typeof arg === 'string') {
			const page_id = arg;
			const cache_data = Page.cache.block.get(page_id);
			if (cache_data) return cache_data;
			const { data: { recordMap } } = await axios.post(
				'https://www.notion.so/api/v3/getBacklinksForBlock',
				{ blockId: page_id },
				Page.headers
			);
			Page.saveToCache(recordMap);
			const target = recordMap.block[page_id];
			if (!target) {
				warn(`No page with the id ${page_id} exists`);
				return undefined;
			}
			return new Promise((resolve) =>
				setTimeout(() => {
					resolve(new Page(recordMap.block[page_id].value));
				}, Page.interval)
			);
		} else if (typeof arg === 'function') {
			const cached_pages = [];
			for (const [ , block ] in Page.cache.block) {
				if (block.type === 'page') cached_pages.push(block);
			}

			const filtered_pages = [];

			for (let i = 0; i < cached_pages.length; i++) {
				const res = await arg(cached_pages[i].value, i);
				if (res) filtered_pages.push(cached_pages[i].value);
			}

			if (filtered_pages.length > 0) return filtered_pages;
			else {
				const { data: { recordMap } } = await axios.post(
					'https://www.notion.so/api/v3/loadUserContent',
					{},
					Page.headers
				);
				Page.saveToCache(recordMap);

				const pages = Object.values(recordMap.block);
				for (let i = 0; i < pages.length; i++) {
					const res = await arg(pages[i].value, i);
					if (res) filtered_pages.push(pages[i].value);
				}
				return filtered_pages;
			}
		}
	}

	/**
   * Create contents for a page except **linked Database** and **Collection view** block
   * @param {ContentOptions} options Options for modifying the content during creation
   */
	async createContent (options = {}) {
		// ? User given after id as position
		// ? Return specific class instances based on content type
		if (this.block_data.type === 'page') {
			const { format = {}, properties = { title: 'Default page title' }, type = 'page' } = options;
			const $content_id = uuidv4();
			const current_time = Date.now();
			if (this.block_data.collection_id)
				error(`The block is of collection_view_page and thus cannot contain a ${type} content`);
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
							if (type === 'page') resolve(new Page(res.data.recordMap.block[$content_id].value));
							else resolve(new Block(res.data.recordMap.block[$content_id].value));
						}, Block.interval)
					);
				} catch (err) {
					error(err.response.data);
				}
			}
		} else {
			error('The block must be of type page to create a content inside it');
			return undefined;
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
			try {
				const { data: { recordMap } } = await axios.post(
					'https://www.notion.so/api/v3/queryCollection',
					{
						collectionId: collection_id,
						collectionViewId: $view_id,
						query: {},
						loader: {
							limit: 70,
							type: 'table'
						}
					},
					Page.headers
				);
				Page.saveToCache(recordMap);
				return new CollectionView({
					parent_data: this.block_data,
					block_data: recordMap.block[$content_id].value
				});
			} catch (err) {
				error(err.response.data);
				return undefined;
			}
		} catch (err) {
			error(err.response.data);
			return undefined;
		}
	}

	async convertToCollectionViewPage (options = {}) {
		// ? Take schema, properties and aggregates as options
		const { type = 'table', name = 'Default view', collection_name = 'Collection view page', format = {} } = options;
		const $collection_id = uuidv4();
		const $view_id = uuidv4();
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
						view_ids: [ $view_id ],
						properties: {},
						created_time: current_time,
						last_edited_time: current_time
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
		const { data: { recordMap, recordMap: { block: collection_view_page } } } = await axios.post(
			`https://www.notion.so/api/v3/loadPageChunk`,
			{
				chunkNumber: 0,
				limit: 50,
				pageId: this.block_data.parent_id,
				verticalColumns: false
			},
			Page.headers
		);
		Page.saveToCache(recordMap);
		return new CollectionViewPage({
			parent_data: this.block_data,
			block_data: collection_view_page[this.block_data.id].value
		});
	}

	async getCollectionViewPage () {
		// ? Return new CollectionViewPage passing parent block data and new block data
		if (!this.block_data.collection_id) {
			error(`The block is not a collection_view_page`);
			return undefined;
		} else {
			const cache_data = Block.cache.collection.get(this.block_data.collection_id);
			if (cache_data)
				return new Collection({
					block_data: this.block_data,
					collection_data: cache_data
				});
			await this.loadUserChunk();

			return new Collection({
				parent_data: this.block_data,
				collection_data: Block.cache.collection.get(this.block_data.collection_id)
			});
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

			const { data: { recordMap } } = await axios.post(
				'https://www.notion.so/api/v3/queryCollection',
				{
					collectionId: $collection_id,
					collectionViewId: $view_id,
					query: {},
					loader: {
						limit: 70,
						type: 'table'
					}
				},
				Page.headers
			);
			Page.saveToCache(recordMap);
			return new CollectionView({
				parent_data: this.block_data,
				block_data: recordMap.block[$collection_view_id].value
			});
		} catch (err) {
			error(err.response.data);
		}
	}
}

module.exports = Page;
