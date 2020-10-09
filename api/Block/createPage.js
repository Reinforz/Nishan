const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const { lastEditOperations, createOperation } = require('./operations');
const { blockUpdate, blockListRemove, blockListAfter, blockSet } = require('./block');
const Transaction = require('./transaction');

module.exports = async function ({ parent_id, spaceId, shardId, token, user_id }) {
	const generated_table_id = uuidv4();
	const generated_table_id2 = uuidv4();

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
			[ blockSet(generated_table_id2, [ 'properties', 'title' ], []) ],
			[
				blockUpdate(generated_table_id, [], {
					id: generated_table_id,
					type: 'page',
					properties: {},
					created_time: current_time,
					last_edited_time: current_time
				}),
				blockUpdate(generated_table_id, [], { parent_id, parent_table: 'block', alive: true }),
				blockListAfter(parent_id, [ 'content' ], { after: generated_table_id2, id: generated_table_id }),
				blockUpdate(generated_table_id2, [], { alive: false }),
				blockListRemove(parent_id, [ 'content' ], { id: generated_table_id2 }),
				...createOperation(generated_table_id, user_id),
				...lastEditOperations(generated_table_id, user_id)
			]
		]),
		opts
	);
};
