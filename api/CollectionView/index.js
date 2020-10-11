const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const CollectionBlock = require('../CollectionBlock');
const Transaction = require('../Transaction');

const { error, warn } = require('../../utils/logs');

class CollectionView extends CollectionBlock {
	constructor (obj) {
		super(obj);
	}

	static setStatic (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (CollectionView[key] = value));
		return CollectionView;
	}
}

module.exports = CollectionView;
