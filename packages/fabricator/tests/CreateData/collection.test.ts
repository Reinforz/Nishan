import { ICache, NotionCacheObject } from '@nishans/cache';
import { IOperation } from '@nishans/types';
import { default_nishan_arg, o } from '../../../core/tests/utils';
import { CreateData } from '../../libs';
import { tsu } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('createCollection', () => {
	it(`should work correctly`, async () => {
		const cache: ICache = NotionCacheObject.createDefaultCache(),
			schema = {
				title: tsu
			};
		const stack: IOperation[] = [];

		const createDataSchemaMock = jest
				.spyOn(CreateData, 'schema')
				.mockImplementationOnce(async () => [ schema, undefined as any, {} ]),
			createDataViewsMock = jest.spyOn(CreateData, 'views').mockImplementationOnce(async () => []),
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
				stack,
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

		expect(createDataViewsMock).toHaveBeenCalledTimes(1);
		expect(createDataSchemaMock).toHaveBeenCalledTimes(1);
		expect(logger).toHaveBeenCalledWith('CREATE', 'collection', collection_data.id);
		expect(stack).toStrictEqual([ o.c.u(collection_data.id, [], output_collection) ]);
		expect(cache.collection.get(collection_data.id)).toStrictEqual(output_collection);
	});

	it(`should work correctly(default input)`, async () => {
		const cache: ICache = NotionCacheObject.createDefaultCache();
		const stack: IOperation[] = [],
			schema = {
				title: tsu
			} as any;

		const createDataSchemaMock = jest
				.spyOn(CreateData, 'schema')
				.mockImplementationOnce(async () => [ schema, undefined as any, {} ]),
			createDataViewsMock = jest.spyOn(CreateData, 'views').mockImplementationOnce(async () => [ {} as any ]),
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
			schema,
			parent_id: 'parent_id',
			parent_table: 'block',
			alive: true,
			name: [ [ 'Collection Name' ] ],
			migrated: false,
			version: 0,
			format: {
				page_section_visibility: {
					backlinks: 'section_show',
					comments: 'section_show'
				}
			},
			cover: '',
			icon: ''
		};

		expect(createDataSchemaMock).toHaveBeenCalledTimes(1);
		expect(createDataViewsMock).toHaveBeenCalledTimes(1);
		expect(logger).toHaveBeenCalledWith('CREATE', 'collection', collection_data.id);
		expect(stack).toStrictEqual([ o.c.u(collection_data.id, [], output_collection) ]);
		expect(cache.collection.get(collection_data.id)).toStrictEqual(output_collection);
	});
});
