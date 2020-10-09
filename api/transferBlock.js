const axios = require('axios');

const { blockSet, blockUpdate, blockListRemove, blockListAfter } = require('./block');
const Transaction = require('./transaction');

module.exports = async function ({ new_parent_id, parent_id, block_id, token, spaceId, shardId }) {
	const transaction = new Transaction({ spaceId, shardId });
	const opts = {
		headers: {
			cookie: `token_v2=${token};`
		}
	};
	const current_time = Date.now();
	await axios.post(
		'https://www.notion.so/api/v3/saveTransactions',
		transaction.createTransaction([
			[
				blockUpdate(block_id, [], { alive: false }),
				blockListRemove(parent_id, [ 'content' ], { id: block_id }),
				blockUpdate(block_id, [], { parent_id: new_parent_id, parent_table: 'block', alive: true }),
				blockListAfter(new_parent_id, [ 'content' ], { id: block_id }),
				blockUpdate(block_id, [], { permissions: null }),
				blockSet(block_id, [ 'last_edited_time' ], current_time),
				blockSet(parent_id, [ 'last_edited_time' ], current_time),
				blockSet(new_parent_id, [ 'last_edited_time' ], current_time)
			]
		]),
		opts
	);
};
