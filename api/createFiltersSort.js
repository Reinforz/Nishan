const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

module.exports = async function ({ sort, filters, pageId, token }) {
	const opts = {
		headers: {
			cookie: `token_v2=${token};`
		}
	};
	const res = await axios.post(
		'https://www.notion.so/api/v3/loadPageChunk',
		{
			pageId,
			limit: 50,
			cursor: { stack: [ [ { table: 'block', id: pageId, index: 0 } ] ] },
			chunkNumber: 0,
			verticalColumns: false
		},
		opts
	);

	const block_ids = Object.values(res.data.recordMap.block)
		.filter((block) => block.value.parent_id === pageId)
		.map((block) => block.value.id);
	const collection_view = Object.values(res.data.recordMap.collection_view).find((collection_view) =>
		block_ids.includes(collection_view.value.parent_id)
	);

	await axios.post(
		'https://www.notion.so/api/v3/saveTransactions',
		{
			requestId: uuidv4(),
			transactions: [
				{
					id: uuidv4(),
					operations: [
						{
							id: collection_view.value.id,
							table: 'collection_view',
							path: [],
							command: 'update',
							args: {
								query2: {
									sort,
									filter: {
										operator: 'and',
										filters
									}
								}
							}
						}
					]
				}
			]
		},
		opts
	);
};
