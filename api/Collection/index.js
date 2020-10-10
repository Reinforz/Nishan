const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const Transaction = require('../Transaction');
const Block = require('../Block');
const View = require('../View');

const { collectionSet } = require('./utils');
const { blockSet, blockListAfter } = require('../Block/utils');
const { collectionViewSet } = require('../CollectionView/utils');
const pluckKeys = require('../../utils/pluckKeys');

class Collection extends Block {
	static setStatic (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (Collection[key] = value));
		return Collection;
	}

	constructor (block_data) {
		super(block_data);
		if (!block_data.type.match(/collection_view/))
			throw new Error(error(`Cannot create collection_view_page block from ${block_data.type} block`));
	}

	async updateProperties (properties) {
		const property_entries = Object.entries(
			pluckKeys(properties, this.collection_data, [
				[ 'name', (data) => [ [ data ] ] ],
				[ 'description', (data) => [ [ data ] ] ],
				'icon'
			])
		);
		await axios.post(
			'https://www.notion.so/api/v3/saveTransactions',
			Transaction.createTransaction([
				[
					...property_entries.map(([ path, arg ]) => collectionSet(this.collection_data.id, [ path ], arg)),
					collectionSet(this.collection_data.id, [ 'last_edited_time' ], Date.now())
				]
			]),
			Collection.headers
		);
	}

	async createView (options = {}) {
		// ? return CollectionView block instance
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
				Collection.headers
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
				Collection.headers
			);
			return new View({ block_data: this.block_data, view_data: collection_view[$view_id].value });
		} else error(`This block is not collection type`);
	}
}

module.exports = Collection;
