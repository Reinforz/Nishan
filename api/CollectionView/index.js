const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const CollectionBlock = require('../CollectionBlock');
const Transaction = require('../Transaction');

const { error, warn } = require('../../utils/logs');

class CollectionView extends CollectionBlock {
	constructor ({ parent_data, block_data }) {
		super({ parent_data, block_data });
		if (block_data.type !== 'collection_view')
			throw new Error(error(`Cannot create collection_view block from ${block_data.type} block`));
	}

	static setStatic (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (CollectionView[key] = value));
		return CollectionView;
	}
}

module.exports = CollectionView;
