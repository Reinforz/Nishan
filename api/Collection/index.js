const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const Transaction = require('../transaction');
const Collection = require('../Collection');

const { blockUpdate, blockSet } = require('../Block/utils');

const { collectionUpdate } = require('../Collection/utils');
const { collectionViewUpdate } = require('../CollectionView/utils');

module.exports = class Collection {
	static setStatic (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (Collection[key] = value));
		return Collection;
	}

	constructor (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (this[key] = value));
	}

	static async getCollection () {}
};
