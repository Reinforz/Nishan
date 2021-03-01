import { ICache, NotionCacheObject } from '@nishans/cache';
import { NotionOperationsObject } from '@nishans/operations';
import { default_nishan_arg, o } from '../../../core/tests/utils';
import { CreateData } from '../../libs';
import { tsu } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`should work correctly`, async () => {
	const cache: ICache = NotionCacheObject.createDefaultCache(),
		schema = {
			title: tsu
		};

	const createDataSchemaMock = jest
			.spyOn(CreateData, 'schema')
			.mockImplementationOnce(async () => [ schema, undefined as any, {} ]),
		createDataViewsMock = jest.spyOn(CreateData, 'views').mockImplementationOnce(async () => []),
		executeOperationsMock = jest
			.spyOn(NotionOperationsObject, 'executeOperations')
			.mockImplementationOnce(async () => undefined),
		logger = jest.fn();

	const [ collection_data ] = await CreateData.collection(
		{
			name: [ [ 'Collection Name' ] ],
			schema: [ tsu ],
			views: [
				{
					type: 'table',
					name: 'Table View',
					schema_units: [ tsu ]
				}
			],
			rows: [],
			icon: 'icon',
			cover: 'cover',
			page_section_visibility: {
				backlinks: 'section_collapsed',
				comments: 'section_hide'
			}
		},
		'parent_id',
		{
			...default_nishan_arg,
			cache,
			logger
		}
	);

	const output_collection = {
		id: collection_data.id,
		schema,
		parent_id: 'parent_id',
		parent_table: 'block',
		alive: true,
		name: [ [ 'Collection Name' ] ],
		migrated: false,
		version: 0,
		cover: 'cover',
		icon: 'icon',
		format: {
			page_section_visibility: {
				backlinks: 'section_collapsed',
				comments: 'section_hide'
			}
		}
	};

	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([ o.c.u(collection_data.id, [], output_collection) ]);
	expect(createDataViewsMock).toHaveBeenCalledTimes(1);
	expect(createDataSchemaMock).toHaveBeenCalledTimes(1);
	expect(logger).toHaveBeenCalledWith('CREATE', 'collection', collection_data.id);
	expect(cache.collection.get(collection_data.id)).toStrictEqual(output_collection);
});
