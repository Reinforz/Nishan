const axios = require('axios');
const { collectionViewUpdate } = require('../CollectionView/utils');

const Transaction = require('../Transaction');

class View {
	constructor (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (this[key] = value));
	}

	static setStatic (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (View[key] = value));
		return View;
	}

	async addFilterSort ({ sort = [], filters = [] }) {
		// ? Respect previous filters
		await axios.post(
			'https://www.notion.so/api/v3/saveTransactions',
			Transaction.createTransaction([
				[
					collectionViewUpdate(this.view_data.id, [], {
						query2: {
							sort,
							filter: {
								operator: 'and',
								filters: filters.map((filter) => ({
									property: filter[0],
									filter: {
										operator: filter[1],
										value: {
											type: filter[2],
											value: filter[3]
										}
									}
								}))
							}
						}
					})
				]
			]),
			View.headers
		);
	}
}

module.exports = View;
