const { v4: uuidv4 } = require('uuid');

class Transaction {
	static setStatic (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (Transaction[key] = value));
		return Transaction;
	}

	static createTransaction (operations) {
		return {
			requestId: uuidv4(),
			transactions: operations.map((operations) => ({
				id: uuidv4(),
				shardId: this.shardId,
				spaceId: this.spaceId,
				operations
			}))
		};
	}
}

module.exports = Transaction;
