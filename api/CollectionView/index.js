const Block = require('../Block');

class CollectionView extends Block {
	constructor (block_data) {
		super(block_data);
	}

	static setStatic (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (CollectionView[key] = value));
		return CollectionView;
	}
}

module.exports = CollectionView;
