import { ICache } from '@nishans/endpoints';
import { ICollection, IOperation, RecordMap, TSchemaUnit } from '@nishans/types';
import deepEqual from 'deep-equal';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import { createCollection, generateRelationSchema, generateSchema, getSchemaMap, ISchemaMapValue, TSchemaUnitInput } from '../../src';

axios.defaults.baseURL = 'https://www.notion.so/api/v3';
const mock = new MockAdapter(axios);

const default_cache: ICache = {
	block: new Map(),
	collection: new Map(),
	space: new Map(),
	collection_view: new Map(),
	notion_user: new Map(),
	space_view: new Map(),
	user_root: new Map(),
	user_settings: new Map()
};

describe('generateRelationSchema', () => {
	describe('Work correctly', () => {
		it(`Should work correctly (child_collection exists in cache)`, async () => {
			const stack: IOperation[] = [], child_collection: ICollection = {
				schema: {
					title: {
						name: 'Title',
						type: 'title'
					}
				},
				id: 'child_collection_id',
				name: [ [ 'Child Collection' ] ]
			} as any, cache: Pick<ICache, "collection"> = {
        collection: new Map([ [ 'child_collection_id', child_collection ] ])
      };
			const relation_schema_unit = await generateRelationSchema(
				{
					type: 'relation',
					collection_id: 'child_collection_id',
					name: 'Parent Relation Column'
				},
				{
					cache,
					id: 'parent_collection_id',
					parent_relation_schema_unit_id: 'parent_relation_schema_unit_id',
					name: [ [ 'Parent Collection' ] ],
					stack,
					token: 'token'
				}
			);

      const child_relation_schema_unit_id = getSchemaMap(child_collection.schema).get("Related to Parent Collection (Parent Relation Column)")?.schema_id ?? "";

      expect(deepEqual(child_collection.schema[child_relation_schema_unit_id], {
        type: "relation",
        collection_id: "parent_collection_id",
        name: `Related to Parent Collection (Parent Relation Column)`,
        property: "parent_relation_schema_unit_id"
      })).toBe(true);

      expect(deepEqual(cache.collection.get("child_collection_id"), {
        name: [["Child Collection"]],
        id: 'child_collection_id',
        schema: {
          [child_relation_schema_unit_id]: {
            type: "relation",
            collection_id: "parent_collection_id",
            name: `Related to Parent Collection (Parent Relation Column)`,
            property: "parent_relation_schema_unit_id"
          },
          title: {
						name: 'Title',
						type: 'title'
					}
        }
      })).toBe(true);

      expect(deepEqual(relation_schema_unit, {
        type: 'relation',
        property: child_relation_schema_unit_id,
        name: 'Parent Relation Column',
        collection_id: 'child_collection_id'
      })).toBe(true)

      expect(deepEqual(stack, [])).toBe(true)
		});

    it(`Should work correctly (child_collection does not exist in cache)`, async () => {
			const stack: IOperation[] = [], child_collection: ICollection = {
				schema: {
					title: {
						name: 'Title',
						type: 'title'
					}
				},
				id: 'child_collection_id',
				name: [ [ 'Child Collection' ] ]
			} as any, cache: Pick<ICache, "collection"> = {
        collection: new Map()
      };

      mock.onPost(`/syncRecordValues`).replyOnce(200, {recordMap: {collection: {
        child_collection_id: {
          role: "editor",
          value: child_collection
        }
      }}})
      
			const relation_schema_unit = await generateRelationSchema(
				{
					type: 'relation',
					collection_id: 'child_collection_id',
					name: 'Parent Relation Column',
				},
				{
					cache,
					id: 'parent_collection_id',
					parent_relation_schema_unit_id: 'parent_relation_schema_unit_id',
					name: [ [ 'Parent Collection' ] ],
					stack,
					token: 'token',
          logger: (method, datatype, id) => {
            expect(method).toBe("READ");
            expect(datatype).toBe("collection");
            expect(id).toBe("child_collection_id");
          }
				}
			);
      
      const child_relation_schema_unit_id = (getSchemaMap((cache.collection.get("child_collection_id") as ICollection).schema).get("Related to Parent Collection (Parent Relation Column)") as ISchemaMapValue).schema_id;
      
      expect(deepEqual(cache.collection.get("child_collection_id"), {
        schema: {
					title: {
						name: 'Title',
						type: 'title'
					},
          [child_relation_schema_unit_id]: {
            type: "relation",
            collection_id: "parent_collection_id",
            name: `Related to Parent Collection (Parent Relation Column)`,
            property: "parent_relation_schema_unit_id"
          }
				},
				id: 'child_collection_id',
				name: [ [ 'Child Collection' ] ],
      })).toBe(true);
      
      expect(deepEqual(relation_schema_unit, {
        type: 'relation',
        property: child_relation_schema_unit_id,
        name: 'Parent Relation Column',
        collection_id: 'child_collection_id'
      })).toBe(true);

      expect(deepEqual(stack, [])).toBe(true);
		});

    it(`Should work correctly (child_collection does not exist in cache + custom child_collection_relation_schema_unit name)`, async () => {
			const stack: IOperation[] = [], child_collection: ICollection = {
				schema: {
					title: {
						name: 'Title',
						type: 'title'
					}
				},
				id: 'child_collection_id',
				name: [ [ 'Child Collection' ] ]
			} as any, cache: Pick<ICache, "collection"> = {
        collection: new Map()
      };

      mock.onPost(`/syncRecordValues`).replyOnce(200, {recordMap: {collection: {
        child_collection_id: {
          role: "editor",
          value: child_collection
        }
      }}});

			const relation_schema_unit = await generateRelationSchema(
				{
					type: 'relation',
					collection_id: 'child_collection_id',
					name: 'Parent Relation Column',
          relation_schema_unit_name: "Child Column"
				},
				{
					cache,
					id: 'parent_collection_id',
					parent_relation_schema_unit_id: 'parent_relation_schema_unit_id',
					name: [ [ 'Parent Collection' ] ],
					stack,
					token: 'token',
          logger: () => {
            return
          }
				}
			);

      const child_relation_schema_unit_id = (getSchemaMap((cache.collection.get("child_collection_id") as ICollection).schema).get("Child Column") as ISchemaMapValue).schema_id;
      
      expect(deepEqual(cache.collection.get("child_collection_id"), {
        schema: {
					title: {
						name: 'Title',
						type: 'title'
					},
          [child_relation_schema_unit_id]: {
            type: "relation",
            collection_id: "parent_collection_id",
            name: `Child Column`,
            property: "parent_relation_schema_unit_id"
          }
				},
				id: 'child_collection_id',
				name: [ [ 'Child Collection' ] ],
      })).toBe(true);
      
      expect(deepEqual(relation_schema_unit, {
        type: 'relation',
        property: child_relation_schema_unit_id,
        name: 'Parent Relation Column',
        collection_id: 'child_collection_id'
      })).toBe(true);

      expect(deepEqual(stack, [{
        table: "collection",
        command: "update",
        id: "child_collection_id",
        path: ["schema", child_relation_schema_unit_id],
        args: {
          type:"relation",
          collection_id: "parent_collection_id",
          name: [["Child Column"]],
          property: "parent_relation_schema_unit_id"
        }
      }])).toBe(true);
		});
	});

  describe('Throw errors', () => {
    it(`Should throw error if non existent collection id is referenced`, async ()=>{
      mock.onPost(`/syncRecordValues`).replyOnce(200, {recordMap: {collection: {
        child_collection_id: {
          role: "editor",
        }
      }}});
  
      await expect(generateRelationSchema(
        {
          type: 'relation',
          collection_id: 'child_collection_id',
          name: 'Parent Relation Column',
        },
        {
          cache: {
            collection: new Map()
          },
          id: 'parent_collection_id',
          parent_relation_schema_unit_id: 'parent_relation_schema_unit_id',
          name: [ [ 'Parent Collection' ] ],
          stack: [],
          token: 'token',
        }
      )).rejects.toThrow(`Collection:child_collection_id doesnot exist`)
    })
  })
  
});

describe('generateSchema', () => {
	describe('Work correctly', () => {
    const input_schema_units: TSchemaUnitInput[] = [
      {
        type: 'title',
        name: 'Title'
      },
      {
        type: 'number',
        name: 'Number'
      },
      {
        type: 'formula',
        name: 'Formula',
        formula: [ 'now()', 'string' ]
      },
      {
        type: 'relation',
        collection_id: 'child_collection_id',
        name: 'Parent Relation Column'
      }
    ];

		it(`generateSchema should work correctly (collection exists in cache)`, async () => {
			const child_collection: ICollection = {
					schema: {
						title: {
							type: 'title',
							name: 'Title'
						}
					},
					name: 'Child',
          id: 'child_collection_id'
				} as any,
				cache: Pick<ICache, 'collection'> = {
					collection: new Map([ [ 'child_collection_id', child_collection ] ])
				};
      
			const [ schema ] = await generateSchema(
				input_schema_units,
				{
					id: 'parent_collection_id',
					name: [ [ 'Parent' ] ],
          token: 'token',
          cache,
          stack: [],
				}
			);

      const child_relation_schema_unit_id = (getSchemaMap(child_collection.schema).get("Related to Parent (Parent Relation Column)") as ISchemaMapValue).schema_id;

      const output_schema_units = [
        {
          type: 'title',
          name: 'Title'
        },
        {
          type: 'number',
          name: 'Number'
        },
        {
          type: 'formula',
          name: 'Formula',
          formula: {
            result_type: 'date',
            name: 'now',
            type: 'function'
          }
        },
        {
          type: 'relation',
          collection_id: 'child_collection_id',
          name: 'Parent Relation Column',
          property: child_relation_schema_unit_id
        }
      ] as TSchemaUnit[];

			expect(
				deepEqual(output_schema_units, Object.values(schema))
			).toBe(true);
		});
	});

	describe('Throws error', () => {
		it(`Should throw error for duplicate property name`, () => {
			expect(() =>
				generateSchema(
					[
						{
							type: 'title',
							name: 'Title'
						},
						{
							type: 'title',
							name: 'Title'
						}
					],
					{
						id: 'parent_collection_id',
						name: [ [ 'Parent' ] ],
            token: 'token',
            stack: [],
            cache: {
              collection: new Map()
            },
					}
				)
			).rejects.toThrow(`Duplicate property Title`);
		});

		it(`Should throw error if title type property not present in schema`, () => {
			expect(() =>
				generateSchema(
					[
						{
							type: 'number',
							name: 'Number'
						}
					],
					{
						id: 'parent_collection_id',
						name: [ [ 'Parent' ] ],
            token: 'token',
            stack: [],
            cache: {
              collection: new Map()
            },
					}
				)
			).rejects.toThrow(`Schema must contain title type property`);
		});
	});
});

describe('createCollection', () => {
  describe('Output correctly', () => {
    it(`createCollection should work correctly`, async ()=>{
      const cache: ICache = default_cache;
      const stack: IOperation[ ]= [];
      const [collection_id] = await createCollection({
        name: [["Collection Name"]],
        schema: [
          {
            type: "title",
            name: "Title"
          }
        ],
        views: [
          {
            type: "table",
            name: "Table View",
            schema_units: [
              {
                type: "title",
                name: "Title",
              }
            ]
          }
        ],
      },'parent_id', {
        cache,
        stack,
        interval: 0,
        logger(){
          return
        },
        shard_id: 123,
        space_id: 'space_id',
        token: 'token',
        user_id: 'user_id'
      });
      const output_collection = {
        id: collection_id,
        schema: {
          title: {
            type: "title",
            name: "Title"
          }
        },
        parent_id: 'parent_id',
        parent_table: 'block',
        alive: true,
        name: [["Collection Name"]],
        migrated: false, 
        version: 0
      };

      expect(typeof collection_id).toBe('string');
      expect(stack.length).toBe(2);
      expect(deepEqual(stack[1], {
        table: "collection",
        command: "update",
        id: collection_id,
        args: output_collection,
        path: []
      })).toBe(true);
      expect(deepEqual(cache.collection.get(collection_id), output_collection)).toBe(true);
    })
  })
})
