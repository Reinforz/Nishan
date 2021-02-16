import { ICollection, IOperation, Schema, TSchemaUnit } from '@nishans/types';
import deepEqual from 'deep-equal';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import { getSchemaMap, ISchemaMapValue, TSchemaUnitInput } from '../../../src';

import {generateRelationSchema, generateRollupSchema, createSchema} from "../../../utils/CreateData/createSchema";

axios.defaults.baseURL = 'https://www.notion.so/api/v3';
const mock = new MockAdapter(axios);

const generateDefaultCache = () => {
  return {
    block: new Map(),
    space: new Map(),
    collection_view: new Map(),
    notion_user: new Map(),
    space_view: new Map(),
    user_root: new Map(),
    user_settings: new Map(),
    collection: new Map()
  }
}

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
			} as any, cache = {
        ...generateDefaultCache(),
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
					parent_collection_id: 'parent_collection_id',
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

    it(`Should work correctly (child_collection exists in db)`, async () => {
			const stack: IOperation[] = [], child_collection: ICollection = {
				schema: {
					title: {
						name: 'Title',
						type: 'title'
					}
				},
				id: 'child_collection_id',
				name: [ [ 'Child Collection' ] ]
			} as any, cache = generateDefaultCache();

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
					parent_collection_id: 'parent_collection_id',
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
			} as any, cache = generateDefaultCache();

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
					parent_collection_id: 'parent_collection_id',
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
          cache: generateDefaultCache(),
          parent_collection_id: 'parent_collection_id',
          parent_relation_schema_unit_id: 'parent_relation_schema_unit_id',
          name: [ [ 'Parent Collection' ] ],
          stack: [],
          token: 'token',
        }
      )).rejects.toThrow(`Collection:child_collection_id doesnot exist`)
    })
  })
});

describe('createSchema', () => {
	describe('Work correctly', () => {
		it(`createSchema should work correctly (collection exists in cache)`, async () => {
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
        },
        {
          type: "rollup",
          collection_id: "target_collection_id",
          name: "Rollup",
          relation_property: "Parent Relation Column",
          target_property: "Title",
        }
      ];

			const child_collection: ICollection = {
					schema: {
						title: {
							type: 'title',
							name: 'Title'
						}
					},
					name: 'Child',
          id: 'child_collection_id'
				} as any,target_collection: ICollection = {
					schema: {
						title: {
							type: 'title',
							name: 'Title'
						}
					},
					name: 'Target Collection',
          id: 'target_collection_id'
				} as any,
				cache = {
          ...generateDefaultCache(),
					collection: new Map([ [ 'child_collection_id', child_collection ], [ 'target_collection_id', target_collection ] ])
				};
      
			const [schema, schema_map, schema_unit_map] = await createSchema(
				input_schema_units,
				{
					parent_collection_id: 'parent_collection_id',
					name: [ [ 'Parent' ] ],
          token: 'token',
          cache,
          stack: [],
          interval: 0,
          shard_id: 123,
          space_id: 'space_1',
          user_id: 'user_1',
          current_schema: {}
				}
			);

      const child_relation_schema_unit_id = (getSchemaMap(child_collection.schema).get("Related to Parent (Parent Relation Column)") as ISchemaMapValue).schema_id;
      const parent_relation_schema_unit_id = (getSchemaMap(schema).get("Parent Relation Column") as ISchemaMapValue).schema_id;

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
        },
        {
          type: "rollup",
          collection_id: "target_collection_id",
          name: "Rollup",
          relation_property: parent_relation_schema_unit_id,
          target_property: "title",
          target_property_type: "title",
          aggregation: undefined
        }
      ] as TSchemaUnit[];

			expect(
				deepEqual(output_schema_units, Object.values(schema))
			).toBe(true);

      expect(Array.from(schema_map.keys())).toStrictEqual(
        [
          'Title',
          "Number",
          "Formula",
          "Parent Relation Column",     
          "Rollup",
        ]
      );
      expect(schema_unit_map.title.get("Title")).not.toBeUndefined();
		});
	});

	describe('Throws error', () => {
		it(`Should throw error for duplicate property name`, () => {
			expect(() =>
				createSchema(
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
						parent_collection_id: 'parent_collection_id',
						name: [ [ 'Parent' ] ],
            token: 'token',
            stack: [],
            cache: generateDefaultCache(),
            interval: 0,
            shard_id: 123,
            space_id: 'space_1',
            user_id: 'user_1'
					}
				)
			).rejects.toThrow(`Duplicate property Title`);
		});

		it(`Should throw error if title type property not present in schema`, () => {
			expect(() =>
				createSchema(
					[
						{
							type: 'number',
							name: 'Number'
						}
					],
					{
						parent_collection_id: 'parent_collection_id',
						name: [ [ 'Parent' ] ],
            token: 'token',
            stack: [],
            cache: generateDefaultCache(),
            interval: 0,
            shard_id: 123,
            space_id: 'space_1',
            user_id: 'user_1'
					}
				)
			).rejects.toThrow(`Schema must contain title type property`);
		});
	});
});

describe('generateRollupSchema', () => {
  const schema: Schema = {
    title: {
      type: "title",
      name: "Title"
    },
    relation: {
      type: "relation",
      collection_id: "target_collection_id",
      name: "Relation",
      property: "child_relation_property"
    }
  };

  describe('Work correctly', () => {
    describe('Collection exists in cache', () => {
      it(`Should work correctly for target_property=title`, async () =>{
        const generated_rollup_schema2 = await generateRollupSchema({
          type: "rollup",
          collection_id: "target_collection_id",
          name: "Rollup Column",
          relation_property: "Relation",
          target_property: "Title",
          aggregation: "average"
        },getSchemaMap(schema), {
          cache: {
            ...generateDefaultCache(),
            collection: new Map([["target_collection_id", {
              schema: {
                title: {
                  type: "title",
                  name: "Title"
                }
              }
            } as any]])
          },
          token: 'token',
          logger: ()=>{
            return
          }
        });
  
        expect(deepEqual(generated_rollup_schema2, {
          type: "rollup",
          collection_id: "target_collection_id",
          name: "Rollup Column",
          relation_property: "relation",
          target_property: "title",
          target_property_type: "title",
          aggregation: "average"
        })).toBe(true);
      });

      it(`Should work correctly for target_property=text`, async () =>{
        const generated_rollup_schema2 = await generateRollupSchema({
          type: "rollup",
          collection_id: "target_collection_id",
          name: "Rollup Column",
          relation_property: "Relation",
          target_property: "Text",
          aggregation: "average"
        },getSchemaMap(schema), {
          cache: {
            ...generateDefaultCache(),
            collection: new Map([["target_collection_id", {
              schema: {
                text: {
                  type: "text",
                  name: "Text"
                }
              }
            } as any]])
          },
          token: 'token',
          logger: ()=>{
            return
          }
        });
  
        expect(deepEqual(generated_rollup_schema2, {
          type: "rollup",
          collection_id: "target_collection_id",
          name: "Rollup Column",
          relation_property: "relation",
          target_property: "text",
          target_property_type: "text",
          aggregation: "average"
        })).toBe(true);
      });

      it(`Should work correctly for target_property=rollup.title`, async ()=>{
        const generated_rollup_schema = await generateRollupSchema({
          type: "rollup",
          collection_id: "target_collection_id",
          name: "Rollup Column",
          relation_property: "Relation",
          target_property: "Rollup",
          aggregation: "average"
        },getSchemaMap(schema), {
          cache: {
            ...generateDefaultCache(),
            collection: new Map([["target_collection_id", {
              schema: {
                rollup: {
                  name: "Rollup",
                  type: "rollup",
                  target_property_type: "title",
                }
              }
            } as any]])
          },
          token: 'token',
          logger: ()=>{
            return
          }
        });
  
        expect(deepEqual(generated_rollup_schema, {
          type: "rollup",
          collection_id: "target_collection_id",
          name: "Rollup Column",
          relation_property: "relation",
          target_property: "rollup",
          target_property_type: "title",
          aggregation: "average"
        })).toBe(true);
      })

      it(`Should work correctly for target_property=rollup.text`, async ()=>{
        const generated_rollup_schema = await generateRollupSchema({
          type: "rollup",
          collection_id: "target_collection_id",
          name: "Rollup Column",
          relation_property: "Relation",
          target_property: "Rollup",
          aggregation: "average"
        },getSchemaMap(schema), {
          cache: {
            ...generateDefaultCache(),
            collection: new Map([["target_collection_id", {
              schema: {
                rollup: {
                  name: "Rollup",
                  type: "rollup",
                  target_property_type: "text",
                }
              }
            } as any]])
          },
          token: 'token',
          logger: ()=>{
            return
          }
        });

        expect(deepEqual(generated_rollup_schema, {
          type: "rollup",
          collection_id: "target_collection_id",
          name: "Rollup Column",
          relation_property: "relation",
          target_property: "rollup",
          target_property_type: "text",
          aggregation: "average"
        })).toBe(true);
      })
  
      it(`Should work correctly for target_property=formula.date`, async ()=>{
        const generated_rollup_schema = await generateRollupSchema({
          type: "rollup",
          collection_id: "target_collection_id",
          name: "Rollup Column",
          relation_property: "Relation",
          target_property: "Formula",
          aggregation: "average"
        },getSchemaMap(schema), {
          cache: {
            ...generateDefaultCache(),
            collection: new Map([["target_collection_id", {
              schema: {
                formula: {
                  type: "formula",
                  name: "Formula",
                  formula: {
                    result_type: "date"
                  }
                }
              }
            } as any]])
          },
          token: 'token',
          logger: ()=>{
            return
          }
        });
  
        expect(deepEqual(generated_rollup_schema, {
          type: "rollup",
          collection_id: "target_collection_id",
          name: "Rollup Column",
          relation_property: "relation",
          target_property: "formula",
          target_property_type: "date",
          aggregation: "average"
        })).toBe(true);
      })
    })
    
    it(`Should work correctly (collection exists in db)`, async ()=>{
      const cache = generateDefaultCache();
  
      mock.onPost(`/syncRecordValues`).replyOnce(200, {recordMap: {collection: {
        target_collection_id: {
          role: "editor",
          value: {
            schema: {
              title: {
                type: "title",
                name: "Title"
              }
            }
          }
        }
      }}});
  
      const generated_rollup_schema = await generateRollupSchema({
        type: "rollup",
        collection_id: "target_collection_id",
        name: "Rollup Column",
        relation_property: "Relation",
        target_property: "Title",
        aggregation: "average"
      },getSchemaMap(schema), {
        cache,
        token: 'token'
      });
  
      expect(deepEqual(generated_rollup_schema, {
        type: "rollup",
        collection_id: "target_collection_id",
        name: "Rollup Column",
        relation_property: "relation",
        target_property: "title",
        target_property_type: "title",
        aggregation: "average"
      })).toBe(true);
  
      expect(deepEqual(cache.collection.get("target_collection_id"), {
        schema: {
          title: {
            type: "title",
            name: "Title"
          }
        }
      })).toBe(true)
    })
  })

  
  describe('Throw errors', () => {
    it(`Should throw for using unknown relation_property`, async ()=>{
      await expect(generateRollupSchema({
        type: "rollup",
        collection_id: "target_collection_id",
        name: "Rollup Column",
        relation_property: "unknown",
        target_property: "unknown"
      },getSchemaMap(schema), {
        cache: generateDefaultCache(),
        token: 'token'
      })).rejects.toThrow(`Unknown property unknown referenced in relation_property`)
    });

    it(`Should throw for using unknown target_property`, async ()=>{
      await expect(generateRollupSchema({
        type: "rollup",
        collection_id: "target_collection_id",
        name: "Rollup Column",
        relation_property: "Relation",
        target_property: "unknown"
      },getSchemaMap(schema), {
        cache: {
          collection: new Map([["target_collection_id", {
            schema: {
              title: {
                type: "title",
                name: "Title"
              }
            }
          } as any]])
        } as any,
        token: 'token'
      })).rejects.toThrow(`Unknown property unknown referenced in target_property`)
    });

    it(`Should throw error if relation property is not relation type`, async()=>{
      await expect(generateRollupSchema({
        type: "rollup",
        collection_id: "target_collection_id",
        name: "Rollup Column",
        relation_property: "Title",
        target_property: "unknown"
      },getSchemaMap(schema), {
        cache: generateDefaultCache(),
        token: 'token'
      })).rejects.toThrow(
        `Property Title referenced in relation_property is not of the supported types\nGiven type: title\nSupported types: relation`
      )
    })

    it(`Should throw error if collection doesnt exist in cache and db`, async()=>{
      mock.onPost(`/syncRecordValues`).replyOnce(200, {recordMap: {collection: {
        target_collection_id: {
          role: "editor",
        }
      }}});

      await expect(generateRollupSchema({
        type: "rollup",
        collection_id: "target_collection_id",
        name: "Rollup Column",
        relation_property: "Relation",
        target_property: "unknown"
      },getSchemaMap(schema), {
        cache: generateDefaultCache(),
        token: 'token'
      })).rejects.toThrow(`Collection:target_collection_id doesnot exist`)
    })
  })
})
