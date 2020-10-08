const copyBlock = require('./api/copyBlock');
const transferBlock = require('./api/transferBlock');
const createFiltersSort = require('./api/createFiltersSort');

class Noshon {
	constructor ({ user_id, shardId, token, spaceId }) {
		this.user_id = user_id;
		this.shardId = shardId;
		this.token = token;
		this.spaceId = spaceId;
	}

	async copyBlock ({ title, new_name, parent_id, source_block_id, spaceId }) {
		return await copyBlock({
			user_id: this.user_id,
			shardId: this.shardId,
			token: this.token,
			spaceId: spaceId ? spaceId : this.spaceId,
			parent_id,
			new_name,
			source_block_id,
			title
		});
	}

	async transferBlock ({ new_parent_id, parent_id, block_id, spaceId }) {
		return await transferBlock({
			user_id: this.user_id,
			shardId: this.shardId,
			spaceId: spaceId ? spaceId : this.spaceId,
			token: this.token,
			new_parent_id,
			parent_id,
			block_id
		});
	}

	async createFiltersSort ({ sort, filters, pageId }) {
		return await createFiltersSort({ sort, filters, pageId, token: this.token });
	}
}

module.exports = Noshon;
