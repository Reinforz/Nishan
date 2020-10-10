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

	constructor ({ user_id, shardId, token, spaceId, interval }) {
		this.user_id = user_id;
		this.shardId = shardId;
		this.token = token;
		this.spaceId = spaceId;
		this.interval = interval || 1000;

		Block.setStatic({
			cache: Nishan.cache,
			interval,
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
			token: this.token,
			headers: {
				headers: {
					cookie: `token_v2=${this.token};`
				}
			}
		});

		Transaction.setStatic({
			shardId,
			spaceId
		});
	}
}

module.exports = Nishan;
