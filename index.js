const axios = require('axios');

const Block = require('./api/Block');
const Collection = require('./api/Collection');
const Transaction = require('./api/Transaction');

class Nishan {
	static cache = {
		block: new Map(),
		collection: new Map(),
		space: new Map()
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
		Block.setStatic({
			cache: Nishan.cache,
			interval,
			user_id,
			token: this.token,
			headers: {
				headers: {
					cookie: `token_v2=${this.token};`
				}
			}
		});

		Collection.setStatic({
			cache: Nishan.cache,
			interval,
			user_id,
			token: this.token,
			headers: {
				headers: {
					cookie: `token_v2=${this.token};`
				}
			}
		});
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
}

module.exports = Nishan;
