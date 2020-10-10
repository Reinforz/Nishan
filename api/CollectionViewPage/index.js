const Block = require('../Block');

class CollectionViewPage extends Block {
	constructor (block_data) {
		super(block_data);
	}

	static setStatic (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (CollectionViewPage[key] = value));
		return CollectionViewPage;
	}
}

module.exports = CollectionViewPage;
