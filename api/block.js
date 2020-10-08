module.exports = {
	blockSet (id, path, args) {
		return {
			table: 'block',
			id,
			path,
			command: 'set',
			args
		};
	},
	blockUpdate (id, path, args) {
		return {
			table: 'block',
			id,
			path,
			command: 'update',
			args
		};
	},
	blockListAfter (id, path, args) {
		return {
			table: 'block',
			id,
			path,
			command: 'listAfter',
			args
		};
	},
	blockListRemove (id, path, args) {
		return {
			table: 'block',
			id,
			path,
			command: 'listRemove',
			args
		};
	}
};
