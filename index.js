const Block = require('./api/Block');

class Nishan {
	static cache = {
		block: new Map(),
		collection: new Map(),
		space: new Map()
	};

	static addToCache (type, id, data) {
		Nishan.cache[type].set(id, data);
	}

	constructor ({ user_id, shardId, token, spaceId, interval }) {
		this.user_id = user_id;
		this.shardId = shardId;
		this.token = token;
		this.spaceId = spaceId;
		this.interval = interval || 500;
	}

	get Block () {
		return Block.setStatic({
			cache: Nishan.cache,
			interval: this.inverval,
			token: this.token,
			shardId: this.shardId,
			spaceId: this.spaceId,
			headers: {
				headers: {
					cookie: `token_v2=${this.token};`
				}
			}
		});
	}
}

module.exports = Nishan;
