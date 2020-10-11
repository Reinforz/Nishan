const axios = require('axios');

const Transaction = require('../Transaction');
const Block = require('../Block');
const View = require('../View');

const { collectionSet } = require('./utils');
const pluckKeys = require('../../utils/pluckKeys');

class Collection extends Block {
	static setStatic (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (Collection[key] = value));
		return Collection;
	}

	constructor ({ block_data, collection_data }) {
		super(block_data);
		if (!block_data.type.match(/collection_view/))
			throw new Error(error(`Cannot create collection_view_page block from ${block_data.type} block`));
		this.collection_data = collection_data;
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
}

module.exports = Collection;
