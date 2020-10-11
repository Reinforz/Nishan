const axios = require('axios');

const Block = require('./api/Block');
const Page = require('./api/Page');
const CollectionView = require('./api/CollectionView');
const CollectionBlock = require('./api/CollectionBlock');
const CollectionViewPage = require('./api/CollectionViewPage');
const View = require('./api/View');
const Collection = require('./api/Collection');
const Transaction = require('./api/Transaction');

class Nishan {
	static cache = {
		block: new Map(),
		collection: new Map(),
		space: new Map(),
		collection_view: new Map()
	};

	static addToCache (type, id, data) {
		Nishan.cache[type].set(id, data);
	}

	constructor ({ token, interval, user_id, shard_id, space_id }) {
		this.token = token;
		this.interval = interval || 1000;
		this.user_id = user_id;
		this.shard_id = shard_id;
		this.space_id = space_id;

		[ Page, CollectionView, CollectionViewPage, View, Collection, Block, CollectionBlock ].forEach((_class) =>
			_class.setStatic({
				cache: Nishan.cache,
				interval,
				user_id,
				token: this.token,
				headers: {
					headers: {
						cookie: `token_v2=${this.token};`
					}
				},
				saveToCache: Nishan.saveToCache
			})
		);
	}

	async getSpace (fn) {
		const { res: { recordMap: { space } } } = await axios.post(
			'https://www.notion.so/api/v3/loadUserContent',
			{},
			{
				headers: {
					cookie: `token_v2=${this.token};`
				}
			}
		);
		let target_space = null;

		target_space = Object.entries(space).find((space) => fn(space.value));
		target_space = target_space || Object.entries(space)[0].value;
		return target_space;
	}

	setSpace (space) {
		Transaction.setStatic({
			shardId: space.shard_id,
			spaceId: space.id
		});
	}

	async getSetSpace (fn) {
		const target_space = await this.getSpace(fn);
		setSpace(target_space);
	}

	async setRootUser () {
		const { res: { recordMap: { user_root } } } = await axios.post(
			'https://www.notion.so/api/v3/loadUserContent',
			{},
			{
				headers: {
					cookie: `token_v2=${this.token};`
				}
			}
		);
		this.user_id = Object.entries(user_root)[0].value.id;
	}

	static saveToCache (recordMap) {
		Object.keys(Nishan.cache).forEach((key) => {
			if (recordMap[key])
				Object.entries(recordMap[key]).forEach(([ record_id, record_value ]) => {
					Nishan.cache[key].set(record_id, record_value.value);
				});
		});
	}
}

module.exports = {
	Nishan,
	Block,
	Page,
	Collection,
	CollectionView,
	CollectionViewPage,
	CollectionBlock
};
