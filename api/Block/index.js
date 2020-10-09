const axios = require('axios');

module.exports = class Block {
	constructor (block_data) {
		this.block_data = block_data;
	}

	static createBlock (block_id) {
		return block_id;
	}

	static async getBlock (block_id, cache, token) {
		const { data: { recordMap } } = await axios.post(
			'https://www.notion.so/api/v3/loadUserContent',
			{},
			{
				headers: {
					cookie: `token_v2=${token}`
				}
			}
		);
		Object.entries(cache).forEach(([ key, map ]) => {
			Object.entries(recordMap[key]).forEach(([ record_id, record_value ]) => {
				cache[key].set(record_id, record_value.value);
			});
		});
		return new Block(recordMap.block[block_id].value);
	}
};
