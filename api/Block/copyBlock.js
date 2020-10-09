const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const { lastEditOperations, createOperation } = require('./operations');
const { blockSet, blockUpdate, blockListAfter } = require('./block');
const Transaction = require('./transaction');

module.exports = async function ({ title, parent_id, spaceId, shardId, token, source_block_id, user_id }) {
	const generated_table_id = uuidv4();
	const opts = {
		headers: {
			cookie: `token_v2=${token};`
		}
	};

	const transaction = new Transaction({ spaceId, shardId });

	await axios.post(
		'https://www.notion.so/api/v3/saveTransactions',
		transaction.createTransaction([
			blockSet(generated_table_id, [], {
				type: 'copy_indicator',
				id: generated_table_id,
				version: 1
			}),
			blockUpdate(generated_table_id, [], {
				parent_id: parent_id,
				parent_table: 'block',
				alive: true
			}),
			blockListAfter(parent_id, [ 'content' ], {
				after: source_block_id,
				id: generated_table_id
			}),
			...lastEditOperations(generated_table_id, user_id),
			...createOperation(generated_table_id, user_id)
		]),
		opts
	);

	await axios.post(
		'https://www.notion.so/api/v3/enqueueTask',
		{
			task: {
				eventName: 'duplicateBlock',
				request: {
					sourceBlockId: source_block_id,
					targetBlockId: generated_table_id,
					addCopyName: title ? false : true
				}
			}
		},
		opts
	);

	return generated_table_id;
};
