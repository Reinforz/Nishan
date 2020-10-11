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

	constructor ({ parent_data, block_data }) {
		super(block_data);
		if (!block_data.type.match(/collection_view/))
			throw new Error(error(`Cannot create collection_block from ${block_data.type} block`));
		this.parent_data = parent_data;
	}

	async createView (options = {}) {
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
		const { data: { recordMap, recordMap: { collection_view } } } = await axios.post(
			'https://www.notion.so/api/v3/loadPageChunk',
			{
				chunkNumber: 0,
				cursor: { stack: [] },
				limit: 50,
				pageId: this.parent_data.id,
				verticalColumns: false
			},
			CollectionBlock.headers
		);
		CollectionBlock.saveToCache(recordMap);
		return new View({
			parent_data: this.block_data,
			view_data: collection_view[$view_id].value
		});
	}

	async getCollection (fromCache = true) {
		if (fromCache)
			return new Collection({
				parent_data: this.block_data,
				collection_data: CollectionBlock.cache.collection.get(this.block_data.collection_id)
			});
		try {
			const { data: { recordMap } } = await axios.post(
				'https://www.notion.so/api/v3/loadPageChunk',
				{
					chunkNumber: 0,
					limit: 50,
					pageId: this.parent_data.parent_id,
					cursor: { stack: [] },
					verticalColumns: false
				},
				CollectionBlock.headers
			);
			CollectionBlock.saveToCache(recordMap);
			return new Collection({
				parent_data: this.parent_data,
				collection_data: recordMap.collection[this.parent_data.collection_id].value
			});
		} catch (err) {
			error(err.response.data);
		}
	}

	async getViews () {
		/* if (fromCache) {
			return CollectionBlock.cache.block.get(this.block_data.id).view_ids.map(
				(view_id) =>
					new View({
						parent_data: this.block_data,
						view_data: CollectionBlock.cache.collection_view.get(view_id)
					})
			);
		} */
		try {
			const { data: { recordMap } } = await axios.post(
				'https://www.notion.so/api/v3/loadPageChunk',
				{
					chunkNumber: 0,
					limit: 50,
					pageId: this.parent_data.id,
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
