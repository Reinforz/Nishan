const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const Transaction = require('../Transaction');
const Collection = require('../Collection');
const Block = require('../Block');
const View = require('../View');

const { blockSet, blockListAfter } = require('../Block/utils');
const { collectionViewSet } = require('../CollectionView/utils');

const { error, warn } = require('../../utils/logs');

class CollectionBlock extends Block {
	static setStatic (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (CollectionBlock[key] = value));
		return CollectionBlock;
	}

	constructor (block_data) {
		super(block_data);
		if (!block_data.type.match(/collection_view/))
			throw new Error(error(`Cannot create collection_view_page block from ${block_data.type} block`));
	}

	async createView (options = {}) {
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
				CollectionBlock.headers
			);
			const { data: { recordMap: { collection_view } } } = await axios.post(
				'https://www.notion.so/api/v3/queryCollection',
				{
					collectionId: this.block_data.collection_id,
					collectionViewId: $view_id,
					query: {},
					loader: {
						limit: 70,
						type: 'table'
					}
				},
				CollectionBlock.headers
			);
			return new View({ block_data: this.block_data, view_data: collection_view[$view_id].value });
		} else error(`This block is not collection type`);
	}

	async getCollection () {
		try {
			const { data: { recordMap } } = await axios.post(
				'https://www.notion.so/api/v3/loadPageChunk',
				{
					chunkNumber: 0,
					limit: 50,
					pageId: this.block_data.parent_id,
					cursor: { stack: [] },
					verticalColumns: false
				},
				CollectionBlock.headers
			);
			CollectionBlock.saveToCache(recordMap);
			return new Collection({
				block_data: this.block_data,
				collection_data: recordMap.collection[this.block_data.collection_id].value
			});
		} catch (err) {
			error(err.response.data);
		}
	}

	async getViews () {
		try {
			const { data: { recordMap } } = await axios.post(
				'https://www.notion.so/api/v3/loadPageChunk',
				{
					chunkNumber: 0,
					limit: 50,
					pageId: this.block_data.parent_id,
					cursor: { stack: [] },
					verticalColumns: false
				},
				CollectionBlock.headers
			);
			CollectionBlock.saveToCache(recordMap);
			return recordMap.block[this.block_data.id].value.view_ids.map(
				(view_id) => new View({ parent_data: this.block_data, view_data: recordMap.collection_view[view_id].value })
			);
		} catch (err) {
			error(err.response.data);
		}
	}
}

module.exports = CollectionBlock;
