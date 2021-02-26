import { ICache, NotionCacheObject } from '@nishans/cache';
import { IOperation } from '@nishans/types';
import { default_nishan_arg, o } from '../../../core/tests/utils';
import { CreateData } from '../../libs';
import { TViewCreateInput } from '../../types';
import { tsu } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`createCollection should work correctly`, async () => {
	const view_input: TViewCreateInput[] = [
		{
			type: 'table',
			name: 'Table View',
			schema_units: [ tsu ]
		}
	];
	const cache: ICache = NotionCacheObject.createDefaultCache();
	const stack: IOperation[] = [];

	const createDataViewsMock = jest.spyOn(CreateData, 'views').mockImplementationOnce(async () => []),
		logger = jest.fn();

	const [ collection_data ] = await CreateData.collection(
		{
			name: [ [ 'Collection Name' ] ],
			schema: [ tsu ],
			views: view_input,
			rows: []
		},
		'parent_id',
		{
			...default_nishan_arg,
			cache,
			stack,
			logger
		}
	);

	const output_collection = {
		id: collection_data.id,
		schema: {
			title: tsu
		},
		parent_id: 'parent_id',
		parent_table: 'block',
		alive: true,
		name: [ [ 'Collection Name' ] ],
		migrated: false,
		version: 0
	};

	expect(createDataViewsMock).toHaveBeenCalledTimes(1);
	expect(createDataViewsMock.mock.calls[0][0]).toStrictEqual({
		...output_collection,
		cover: undefined,
		icon: undefined
	});
	expect(createDataViewsMock.mock.calls[0][1]).toBe(view_input);
	expect(logger).toHaveBeenCalledWith('CREATE', 'collection', collection_data.id);
	expect(stack).toStrictEqual([ o.c.u(collection_data.id, [], output_collection) ]);
	expect(cache.collection.get(collection_data.id)).toStrictEqual(output_collection);
});
