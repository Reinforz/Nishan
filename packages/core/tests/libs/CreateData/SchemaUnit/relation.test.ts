import { NotionCacheObject } from "@nishans/cache";
import { Queries } from "@nishans/endpoints";
import { generateSchemaMapFromCollectionSchema, ISchemaMapValue } from "@nishans/notion-formula";
import { ICollection, IOperation } from "@nishans/types";
import { relation } from "../../../../libs/CreateData/SchemaUnit/relation";

describe('relation', () => {
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
        ...NotionCacheObject.createDefaultCache(),
        collection: new Map([ [ 'child_collection_id', child_collection ] ])
      };
			const relation_schema_unit = await relation(
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

      const child_relation_schema_unit_id = generateSchemaMapFromCollectionSchema(child_collection.schema).get("Related to Parent Collection (Parent Relation Column)")?.schema_id ?? "";

      expect(child_collection.schema[child_relation_schema_unit_id]).toStrictEqual({
        type: "relation",
        collection_id: "parent_collection_id",
        name: `Related to Parent Collection (Parent Relation Column)`,
        property: "parent_relation_schema_unit_id"
      });

      expect(cache.collection.get("child_collection_id")).toStrictEqual({
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
        }});

      expect(relation_schema_unit).toStrictEqual({
        type: 'relation',
        property: child_relation_schema_unit_id,
        name: 'Parent Relation Column',
        collection_id: 'child_collection_id'
      })

      expect(stack).toStrictEqual([])
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
			} as any, cache = NotionCacheObject.createDefaultCache();

      jest.spyOn(Queries, 'syncRecordValues').mockImplementationOnce(async ()=>{
        return {recordMap: {collection: {
          child_collection_id: {
            role: "editor",
            value: child_collection
          }
        }}} as any
      })

			const relation_schema_unit = await relation(
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
      
      const child_relation_schema_unit_id = (generateSchemaMapFromCollectionSchema((cache.collection.get("child_collection_id") as ICollection).schema).get("Related to Parent Collection (Parent Relation Column)") as ISchemaMapValue).schema_id;
      
      expect(cache.collection.get("child_collection_id")).toStrictEqual({
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
      });
      
      expect(relation_schema_unit).toStrictEqual({
        type: 'relation',
        property: child_relation_schema_unit_id,
        name: 'Parent Relation Column',
        collection_id: 'child_collection_id'
      });

      expect(stack).toStrictEqual([]);
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
			} as any, cache = NotionCacheObject.createDefaultCache();

      jest.spyOn(Queries, 'syncRecordValues').mockImplementationOnce(async ()=>{
        return {recordMap: {collection: {
          child_collection_id: {
            role: "editor",
            value: child_collection
          }
        }}} as any
      })

			const relation_schema_unit = await relation(
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

      const child_relation_schema_unit_id = (generateSchemaMapFromCollectionSchema((cache.collection.get("child_collection_id") as ICollection).schema).get("Child Column") as ISchemaMapValue).schema_id;
      
      expect(cache.collection.get("child_collection_id")).toStrictEqual({
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
      });
      
      expect(relation_schema_unit).toStrictEqual({
        type: 'relation',
        property: child_relation_schema_unit_id,
        name: 'Parent Relation Column',
        collection_id: 'child_collection_id'
      });

      expect(stack).toStrictEqual([{
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
      }]);
		});
	});

  describe('Throw errors', () => {
    it(`Should throw error if non existent collection id is referenced`, async ()=>{
      jest.spyOn(Queries, 'syncRecordValues').mockImplementationOnce(async ()=>{
        return {recordMap: {collection: {
          child_collection_id: {
            role: "editor",
          }
        }}} as any
      })

      await expect(relation(
        {
          type: 'relation',
          collection_id: 'child_collection_id',
          name: 'Parent Relation Column',
        },
        {
          cache: NotionCacheObject.createDefaultCache(),
          parent_collection_id: 'parent_collection_id',
          parent_relation_schema_unit_id: 'parent_relation_schema_unit_id',
          name: [ [ 'Parent Collection' ] ],
          stack: [],
          token: 'token',
        }
      )).rejects.toThrow()
    })
  })
});
