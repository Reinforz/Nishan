import { NotionCache } from '@nishans/cache';
import { idToUuid, uuidToId } from '@nishans/idz';
import { NotionFormula } from '../libs';
import { dsmu, dsu, tsmu, tsu } from './utils';

it('generateSchemaMap', async () => {
	const id = idToUuid(uuidToId('4b4bb21df68b4113b342830687a5337a'));
	const initializeCacheForSpecificDataMock = jest
		.spyOn(NotionCache, 'initializeCacheForSpecificData')
		.mockImplementationOnce(async () => undefined);

	const schema_map = await NotionFormula.generateSchemaMapFromRemoteSchema(id, {
		token: 'token',
		cache: {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ id, { collection_id: 'collection_1' } as any ] ]),
			collection: new Map([
				[
					'collection_1',
					{
						schema: {
							date: dsu,
							title: tsu
						}
					} as any
				]
			])
		}
	});

	expect(Array.from(schema_map.entries())).toStrictEqual([ dsmu, tsmu ]);
	expect(initializeCacheForSpecificDataMock).toHaveBeenCalledTimes(1);
	expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ id, 'block' ]);
});
