const axios = require('axios');

const { blockSet } = require('./block');
const Transaction = require('./transaction');

module.exports = async function ({ page_id, title, spaceId, shardId, token }) {
	const transaction = new Transaction({ spaceId, shardId });

	const opts = {
		headers: {
			cookie: `token_v2=${token};`
		}
	};

	await axios.post(
		'https://www.notion.so/api/v3/saveTransactions',
		transaction.createTransaction([
			[
				blockSet(page_id, [ 'properties', 'title' ], [ [ title ] ]),
				blockSet(page_id, [ 'last_edited_time' ], Date.now())
			]
		]),
		opts
	);
};
