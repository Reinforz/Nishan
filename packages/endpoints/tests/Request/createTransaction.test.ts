import { NotionEndpoints } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it('createTransaction', () => {
	const transactions = NotionEndpoints.Request.createTransaction(123, 'space_id', []);
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
