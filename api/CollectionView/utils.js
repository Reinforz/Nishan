function collectionView (id, path, args, command) {
	const res = {
		path,
		table: 'collection_view',
		command,
		args
	};
	if (id) res.id = id;
	return res;
}

module.exports = {
	collectionViewSet: (id, path, args) => collectionView(id, path, args, 'set'),
	collectionViewUpdate: (id, path, args) => collectionView(id, path, args, 'update'),
	collectionViewListAfter: (id, path, args) => collectionView(id, path, args, 'listAfter'),
	collectionViewListRemove: (id, path, args) => collectionView(id, path, args, 'listRemove')
};
