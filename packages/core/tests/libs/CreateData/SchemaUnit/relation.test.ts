import { ICache, NotionCacheObject } from "@nishans/cache";
import { generateSchemaMapFromCollectionSchema, ISchemaMapValue } from "@nishans/notion-formula";
import { ICollection, IOperation } from "@nishans/types";
import { relation } from "../../../../libs/CreateData/SchemaUnit/relation";
import { ParentCollectionData } from "../../../../libs/CreateData/types";

const returnChildCollectionAndCache = () =>{
  const child_collection: ICollection = {
    schema: {
      title: {
        name: 'Title',
        type: 'title'
      }
    },
    id: 'child_collection_id',
    name: [ [ 'Child Collection' ] ]
  } as any;
  const cache = {
    ...NotionCacheObject.createDefaultCache(),
    collection: new Map([ [ 'child_collection_id', child_collection ] ])
  } as ICache;
  const stack: IOperation[] = [];
  const parent_collection_data: ParentCollectionData = {
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
  return [child_collection, cache, stack, parent_collection_data] as const;
}
  

it(`Should work correctly (default child_collection_relation_schema_unit name)`, async () => {
  const  [child_collection, cache, stack, parent_collection_data] = returnChildCollectionAndCache();
  const relation_schema_unit = await relation(
    {
      type: 'relation',
      collection_id: 'child_collection_id',
      name: 'Parent Relation Column'
    },
    parent_collection_data
  );

  const child_relation_schema_unit_id = generateSchemaMapFromCollectionSchema(child_collection.schema).get("Related to Parent Collection (Parent Relation Column)")?.schema_id ?? "";

  expect(child_collection.schema[child_relation_schema_unit_id]).toStrictEqual({
    type: "relation",
    collection_id: "parent_collection_id",
    name: `Related to Parent Collection (Parent Relation Column)`,
    property: "parent_relation_schema_unit_id"
  });

  expect(cache.collection.get("child_collection_id")?.schema[child_relation_schema_unit_id]).toStrictEqual({
    type: "relation",
    collection_id: "parent_collection_id",
    name: `Related to Parent Collection (Parent Relation Column)`,
    property: "parent_relation_schema_unit_id"
  });

  expect(relation_schema_unit).toStrictEqual({
    type: 'relation',
    property: child_relation_schema_unit_id,
    name: 'Parent Relation Column',
    collection_id: 'child_collection_id'
  })

  expect(stack.length).toBe(0)
});

it(`Should work correctly (custom child_collection_relation_schema_unit name)`, async () => {
  const [, cache, stack, parent_collection_data] = returnChildCollectionAndCache();

  const relation_schema_unit = await relation(
    {
      type: 'relation',
      collection_id: 'child_collection_id',
      name: 'Parent Relation Column',
      relation_schema_unit_name: "Child Column"
    },
    parent_collection_data
  );

  const child_relation_schema_unit_id = (generateSchemaMapFromCollectionSchema((cache.collection.get("child_collection_id") as ICollection).schema).get("Child Column") as ISchemaMapValue).schema_id;
  
  expect(cache.collection.get("child_collection_id")?.schema[child_relation_schema_unit_id]).toStrictEqual({
    type: "relation",
    collection_id: "parent_collection_id",
    name: `Child Column`,
    property: "parent_relation_schema_unit_id"
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