const axios = require('axios');

const Transaction = require('./transaction');
const { blockUpdate, blockListRemove, blockSet } = require('./utils');

class Block {
	static setStatic (obj) {
		Object.entries(obj).forEach(([ key, value ]) => (Block[key] = value));
		return Block;
	}

	static createBlock (block_id) {
		return block_id;
	}

	constructor (block_data) {
		this.block_data = block_data;
	}

	get Transaction () {
		return Transaction.setStatic({
			shardId: this.block_data.shard_id,
			spaceId: this.block_data.space_id
		});
	}

	async deleteBlock () {
		await axios.post(
			'https://www.notion.so/api/v3/saveTransactions',
			this.Transaction.createTransaction([
				[
					blockUpdate(this.block_data.id, [], {
						alive: false
					}),
					blockListRemove(this.block_data.parent_id, [ 'content' ], { id: this.block_data.id }),
					blockSet(this.block_data.id, [ 'last_edited_time' ], Date.now())
				]
			]),
			Block.headers
		);

		Block.cache.block.delete(this.block_data.id);
		return new Promise((resolve) => setTimeout(() => resolve(res), this.interval));
	}

	static async getBlock (block_id, options = {}) {
		const { nested = false } = options;
		if (Block.cache.block.has(block_id)) return Block.cache.block.get(block_id);
		const url = nested
			? 'https://www.notion.so/api/v3/getBacklinksForBlock'
			: 'https://www.notion.so/api/v3/loadUserContent';
		const data = nested ? { blockId: block_id } : {};

		const { data: { recordMap } } = await axios.post(url, data, Block.headers);
		Object.entries(Block.cache).forEach(([ key, map ]) => {
			if (recordMap[key])
				Object.entries(recordMap[key]).forEach(([ record_id, record_value ]) => {
					Block.cache[key].set(record_id, record_value.value);
				});
		});
		return new Promise((resolve) =>
			setTimeout(() => resolve(new Block(recordMap.block[block_id].value)), Block.interval)
		);
	}
}

module.exports = Block;
