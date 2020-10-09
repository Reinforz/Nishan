const { v4: uuidv4 } = require('uuid');

class Transaction {
	constructor ({ spaceId, shardId }) {
		this.spaceId = spaceId;
		this.shardId = shardId;
	}

	createTransaction (operations) {
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
