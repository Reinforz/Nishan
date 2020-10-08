const copyBlock = require('./api/copyBlock');

class Noshon {
	constructor ({ user_id, shardId, token, spaceId }) {
		this.user_id = user_id;
		this.shardId = shardId;
		this.token = token;
		this.spaceId = spaceId;
	}

	async copyBlock ({ new_name, parent_id, source_block_id, spaceId }) {
		return await copyBlock({
			user_id: this.user_id,
			shardId: this.shardId,
			token: this.token,
			spaceId: spaceId ? spaceId : this.spaceId,
			parent_id,
			new_name,
			source_block_id
		});
	}
}

module.exports = Noshon;
