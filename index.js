const Block = require('./api/Block/index');
const copyBlock = require('./api/copyBlock');
const transferBlock = require('./api/transferBlock');
const createFiltersSort = require('./api/createFiltersSort');
const createPage = require('./api/createPage');
const deleteBlock = require('./api/deleteBlock');
const changePageTitle = require('./api/changePageTitle');

class Noshon {
	static cache = {
		block: new Map(),
		collection: new Map(),
		space: new Map()
	};

	constructor ({ user_id, shardId, token, spaceId, interval }) {
		this.user_id = user_id;
		this.shardId = shardId;
		this.token = token;
		this.spaceId = spaceId;
		this.interval = interval || 500;
	}

	static addToCache (type, id, data) {
		Noshon.cache[type].set(id, data);
	}

	async changePageTitle ({ page_id, title }) {
		const res = await changePageTitle({
			page_id,
			title,
			spaceId: this.spaceId,
			shardId: this.shardId,
			token: this.token
		});
		return new Promise((resolve) => setTimeout(() => resolve(res), this.interval));
	}

	async copyBlock ({ title, new_name, parent_id, source_block_id, spaceId }) {
		const res = await copyBlock({
			user_id: this.user_id,
			shardId: this.shardId,
			token: this.token,
			spaceId: spaceId ? spaceId : this.spaceId,
			parent_id,
			new_name,
			source_block_id,
			title
		});
		return new Promise((resolve) => setTimeout(() => resolve(res), this.interval));
	}

	async transferBlock ({ new_parent_id, parent_id, block_id, spaceId }) {
		const res = await transferBlock({
			user_id: this.user_id,
			shardId: this.shardId,
			spaceId: spaceId ? spaceId : this.spaceId,
			token: this.token,
			new_parent_id,
			parent_id,
			block_id
		});
		return new Promise((resolve) => setTimeout(() => resolve(res), this.interval));
	}

	async createFiltersSort ({ sort, filters, pageId }) {
		const res = await createFiltersSort({ sort, filters, pageId, token: this.token });
		return new Promise((resolve) => setTimeout(() => resolve(res), this.interval));
	}

	async createPage ({ parent_id }) {
		const res = await createPage({
			parent_id,
			user_id: this.user_id,
			shardId: this.shardId,
			spaceId: this.spaceId,
			token: this.token
		});
		return new Promise((resolve) => setTimeout(() => resolve(res), this.interval));
	}

	async deleteBlock ({ parent_id, target_id }) {
		const res = await deleteBlock({
			parent_id,
			target_id,
			user_id: this.user_id,
			shardId: this.shardId,
			spaceId: this.spaceId,
			token: this.token
		});
		return new Promise((resolve) => setTimeout(() => resolve(res), this.interval));
	}

	async getBlock (block_id) {
		if (Noshon.cache.block.has(block_id)) return Noshon.cache.block.get(block_id);

		const res = await Block.getBlock(block_id, Noshon.cache, this.token);
		return new Promise((resolve) => setTimeout(() => resolve(res), this.interval));
	}
}

module.exports = Noshon;
