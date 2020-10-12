function space (id, path, args, command) {
	const res = {
		path,
		table: 'space',
		command,
		args
	};
	if (id) res.id = id;
	return res;
}

module.exports = {
	spaceSet: (id, path, args) => space(id, path, args, 'set'),
	spaceUpdate: (id, path, args) => space(id, path, args, 'update'),
	spaceListAfter: (id, path, args) => space(id, path, args, 'listAfter'),
	spaceListBefore: (id, path, args) => space(id, path, args, 'listBefore'),
	spaceListRemove: (id, path, args) => space(id, path, args, 'listRemove')
};
