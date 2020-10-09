const axios = require('axios');

const { blockUpdate, blockListRemove, blockSet } = require('./block');
const Transaction = require('./transaction');

module.exports = async function ({ parent_id, target_id, user_id, shardId, spaceId, token }) {
	const opts = {
		headers: {
			cookie: `token_v2=${token};`
		}
	};
	const transaction = new Transaction({ spaceId, shardId });
	const current_time = Date.now();

	await axios.post(
		'https://www.notion.so/api/v3/saveTransactions',
		transaction.createTransaction([
			[
				blockUpdate(target_id, [], {
					alive: false
				}),
				blockListRemove(parent_id, [ 'content' ], { id: target_id }),
				blockSet(target_id, [ 'last_edited_time' ], current_time),
				blockSet(parent_id, [ 'last_edited_time' ], current_time)
			]
		]),
		opts
	);
};
