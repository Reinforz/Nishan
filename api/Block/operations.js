const { blockSet } = require('./utils');

module.exports = {
	createOperation (generated_table_id, user_id) {
		return [
			blockSet(generated_table_id, [ 'created_by_id' ], user_id),
			blockSet(generated_table_id, [ 'created_by_table' ], 'notion_user'),
			blockSet(generated_table_id, [ 'created_time' ], Date.now())
		];
	},
	lastEditOperations (generated_table_id, user_id) {
		return [
			blockSet(generated_table_id, [ 'last_edited_time' ], Date.now()),
			blockSet(generated_table_id, [ 'last_edited_by_id' ], user_id),
			blockSet(generated_table_id, [ 'last_edited_by_table' ], 'notion_user')
		];
	}
};
