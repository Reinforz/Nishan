function collection (id, path, args, command) {
	const res = {
		path,
		table: 'collection',
		command,
		args
	};
	if (id) res.id = id;
	return res;
}

module.exports = {
	collectionSet: (id, path, args) => collection(id, path, args, 'set'),
	collectionUpdate: (id, path, args) => collection(id, path, args, 'update'),
	collectionListAfter: (id, path, args) => collection(id, path, args, 'listAfter'),
	collectionListRemove: (id, path, args) => collection(id, path, args, 'listRemove')
};
