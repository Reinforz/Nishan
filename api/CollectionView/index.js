const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const Collection = require('../Collection');
const Transaction = require('../Transaction');

const { error, warn } = require('../../utils/logs');

class CollectionView extends Collection {
	constructor (block_data) {
		super(block_data);
	}

	static setStatic (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (CollectionView[key] = value));
		return CollectionView;
	}
}

module.exports = CollectionView;
