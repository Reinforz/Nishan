import { Queries } from '@nishans/endpoints';
import { idToUuid, uuidToId } from '@nishans/idz';
import { generateSchemaMap } from '../../src';
import { dsmu, dsu, tsmu, tsu } from './utils';

it('generateSchemaMap', async () => {
	const id = idToUuid(uuidToId('4b4bb21df68b4113b342830687a5337a'));
	const syncRecordValuesMock = jest.spyOn(Queries, 'syncRecordValues');
	syncRecordValuesMock.mockImplementationOnce(async () => {
		return {
			recordMap: {
				block: {
					[id]: {
						value: {
							collection_id: 'collection_1'
						}
					}
				}
			}
		} as any;
	});

	syncRecordValuesMock.mockImplementationOnce(async () => {
		return {
			recordMap: {
				collection: {
					collection_1: {
						value: {
							schema: {
								date: dsu,
								title: tsu
							}
						}
					}
				}
			}
		} as any;
	});

	const schema_map = await generateSchemaMap('token', id);

	expect(Array.from(schema_map.entries())).toStrictEqual([ dsmu, tsmu ]);
	expect(syncRecordValuesMock).toHaveBeenCalledTimes(2);
	expect(syncRecordValuesMock.mock.calls[0][0]).toStrictEqual({
		requests: [
			{
				table: 'block',
				id,
				version: 0
			}
		]
	});
	expect(syncRecordValuesMock.mock.calls[1][0]).toStrictEqual({
		requests: [
			{
				table: 'collection',
				id: 'collection_1',
				version: 0
			}
		]
	});
});
