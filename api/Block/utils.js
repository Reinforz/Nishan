function block (id, path, args, command) {
	const res = {
		path,
		table: 'block',
		command,
		args
	};
	if (id) res.id = id;
	return res;
}

module.exports = {
	blockSet: (id, path, args) => block(id, path, args, 'set'),
	blockUpdate: (id, path, args) => block(id, path, args, 'update'),
	blockListAfter: (id, path, args) => block(id, path, args, 'listAfter'),
	blockListRemove: (id, path, args) => block(id, path, args, 'listRemove')
};
