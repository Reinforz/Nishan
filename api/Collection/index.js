const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const Transaction = require('../transaction');

const { collectionSet } = require('../Collection/utils');
const pluckKeys = require('../../utils/pluckKeys');

class Collection {
	static setStatic (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (Collection[key] = value));
		return Collection;
	}

	constructor (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (this[key] = value));
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
