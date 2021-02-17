import { createTransaction } from '../../src';

describe.only('createTransaction', () => {
	it(`Should create correct request`, () => {
		const transactions = createTransaction(123, 'space_id', []);
		const data = JSON.parse(JSON.stringify(transactions));
		expect(data.transactions[0]).toEqual(
			expect.objectContaining({
				id: expect.any(String),
				shardId: 123,
				spaceId: 'space_id',
				operations: expect.any(Array)
			})
		);
	});
});
