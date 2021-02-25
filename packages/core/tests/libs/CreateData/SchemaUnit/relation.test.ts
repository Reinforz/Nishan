import { ICache, NotionCacheObject } from "@nishans/cache";
import { generateSchemaMapFromCollectionSchema } from "@nishans/notion-formula";
import { ICollection, IOperation } from "@nishans/types";
import { CreateData } from "../../../../libs/CreateData";
import { ParentCollectionData } from "../../../../libs/CreateData/types";
import { o } from "../../../utils";
import { tsu } from "../utils";

const returnChildCollectionAndCache = () =>{
  const child_collection: ICollection = {
    schema: {
      title: tsu
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
  return [child_collection, stack, parent_collection_data] as const;
}

const getChildRelationSchemaUnitId = (child_collection: ICollection, name: string) => generateSchemaMapFromCollectionSchema(child_collection.schema).get(name)?.schema_id as string;

const common_child_collection_relation_schema_unit = {
  type: "relation",
  collection_id: "parent_collection_id",
  property: "parent_relation_schema_unit_id"
}, common_parent_collection_relation_schema_unit = {
  type: 'relation',
  name: 'Parent Relation Column',
  collection_id: 'child_collection_id'
}, relation_arg = {
  collection_id: 'child_collection_id',
  name: 'Parent Relation Column'
};

it(`Should work correctly (default child_collection_relation_schema_unit name)`, async () => {
  const  [child_collection, stack, parent_collection_data] = returnChildCollectionAndCache();
  const relation_schema_unit = await CreateData.schema_unit.relation(
    relation_arg,
    parent_collection_data
  );

  const child_relation_schema_unit_id = getChildRelationSchemaUnitId(child_collection, "Related to Parent Collection (Parent Relation Column)");
  
  expect(child_collection.schema[child_relation_schema_unit_id]).toStrictEqual({
    name: `Related to Parent Collection (Parent Relation Column)`,
    ...common_child_collection_relation_schema_unit
  });

  expect(relation_schema_unit).toStrictEqual({
    property: child_relation_schema_unit_id,
    ...common_parent_collection_relation_schema_unit
  })

  expect(stack.length).toBe(0)
});

it(`Should work correctly (custom child_collection_relation_schema_unit name)`, async () => {
  const [child_collection, stack, parent_collection_data] = returnChildCollectionAndCache();

  const relation_schema_unit = await CreateData.schema_unit.relation(
    {
      ...relation_arg,
      relation_schema_unit_name: "Child Column"
    },
    parent_collection_data
  );

  const child_relation_schema_unit_id = getChildRelationSchemaUnitId(child_collection, "Child Column");
  
  expect(child_collection.schema[child_relation_schema_unit_id]).toStrictEqual({
    name: `Child Column`,
    ...common_child_collection_relation_schema_unit
  });
  
  expect(relation_schema_unit).toStrictEqual({
    property: child_relation_schema_unit_id,
    ...common_parent_collection_relation_schema_unit
  });

  expect(stack).toStrictEqual([o.c.u("child_collection_id", ["schema", child_relation_schema_unit_id], {
    name: [["Child Column"]],
    ...common_child_collection_relation_schema_unit
  })]);
});