import { NotionCache } from "@nishans/cache";
import { NotionLogger } from "@nishans/logger";
import { NotionOperations } from "@nishans/operations";
import { ICache, ICollection } from "@nishans/types";
import { NotionUtils } from "@nishans/utils";
import { default_nishan_arg, o } from "../../../../core/tests/utils";
import { NotionFabricator } from "../../../libs";
import { ParentCollectionData } from "../../../types";
import { tsu } from "../../utils";

afterEach(()=>{
  jest.restoreAllMocks()
});

const returnChildCollectionAndCache = () =>{
  const child_collection: ICollection = {
    schema: {
      title: tsu
    },
    id: 'child_collection_id',
    name: [ [ 'Child Collection' ] ]
  } as any;
  const cache = {
    ...NotionCache.createDefaultCache(),
    collection: new Map([ [ 'child_collection_id', child_collection ] ])
  } as ICache;
  const parent_collection_data: ParentCollectionData = {
    parent_collection_id: 'parent_collection_id',
    parent_relation_schema_unit_id: 'parent_relation_schema_unit_id',
    name: [ [ 'Parent Collection' ] ],
  }
  return [child_collection, cache, parent_collection_data] as const;
}

const getChildRelationSchemaUnitId = (child_collection: ICollection, name: string) => NotionUtils.generateSchemaMap(child_collection.schema).get(name)?.schema_id as string;

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
  const  [child_collection, cache, parent_collection_data] = returnChildCollectionAndCache();
  const executeOperationsMock = jest
			.spyOn(NotionOperations, 'executeOperations')
			.mockImplementationOnce(async () => undefined);
	const logger_spy = jest.spyOn(NotionLogger.method, 'info').mockImplementation(() => undefined as any);
      
  const relation_schema_unit = await NotionFabricator.CreateData.schema_unit.relation(
    relation_arg,
    parent_collection_data,
    {...default_nishan_arg, cache}
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
  expect(executeOperationsMock).not.toHaveBeenCalled();
  expect(logger_spy).toHaveBeenCalledTimes(1);
  expect(logger_spy).toHaveBeenCalledWith("READ collection child_collection_id");
});

it(`Should work correctly (custom child_collection_relation_schema_unit name)`, async () => {
  const [child_collection, cache, parent_collection_data] = returnChildCollectionAndCache();
  const executeOperationsMock = jest
  .spyOn(NotionOperations, 'executeOperations')
  .mockImplementationOnce(async () => undefined);

	const logger_spy = jest.spyOn(NotionLogger.method, 'info').mockImplementation(() => undefined as any);

  const relation_schema_unit = await NotionFabricator.CreateData.schema_unit.relation(
    {
      ...relation_arg,
      relation_schema_unit_name: "Child Column"
    },
    parent_collection_data,
    {
      ...default_nishan_arg,
      cache,
    }
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

  expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([o.c.u("child_collection_id", ["schema", child_relation_schema_unit_id], {
    name: [["Child Column"]],
    ...common_child_collection_relation_schema_unit
  })]);
  expect(logger_spy).toHaveBeenCalledTimes(2);
  expect(logger_spy).toHaveBeenNthCalledWith(1, "READ collection child_collection_id");
  expect(logger_spy).toHaveBeenNthCalledWith(2, "UPDATE collection child_collection_id");
});