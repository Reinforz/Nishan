import { ICache, NotionCacheObject } from '@nishans/cache';
import { NotionOperationsObject } from '@nishans/operations';
import { tsu, txsu } from '../../../fabricator/tests/utils';
import { SchemaUnit } from '../../libs';
import { default_nishan_arg, o } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`update`, async () => {
  const cache: ICache = {
    ...NotionCacheObject.createDefaultCache(),
    collection: new Map([
      [
        'collection_1',
        {
          schema: {
            schema_id_1: txsu
          }
        }
      ] as any
    ]),
  };

  const logger = jest.fn();
  const schema_unit = new SchemaUnit({
    ...default_nishan_arg,
    cache,
    id: 'collection_1',
    schema_id: 'schema_id_1',
    logger
  }), executeOperationsMock = jest.spyOn(NotionOperationsObject, 'executeOperations').mockImplementation(async()=>undefined);

  const update_arg: any = {
    type: 'text',
    name: 'New Name'
  }
  await schema_unit.update(update_arg);

  expect(logger).toHaveBeenCalledTimes(1);
  expect(logger).toHaveBeenCalledWith("UPDATE", "collection", 'collection_1');

  expect(cache.collection.get('collection_1')?.schema).toStrictEqual({
    schema_id_1: update_arg
  });

  expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
    o.c.u('collection_1', [], {
      schema: {
        schema_id_1: update_arg
      }
    })
  ])
});

describe('delete', () => {
  it(`type=text`, async () => {
    const cache: ICache = {
      ...NotionCacheObject.createDefaultCache(),
      collection: new Map([
        [
          'collection_1',
          {
            schema: {
              schema_id_1: txsu,
              schema_id_2: tsu
            }
          }
        ] as any
      ]),
    },
      executeOperationsMock = jest.spyOn(NotionOperationsObject, 'executeOperations').mockImplementation(async()=>undefined);

    const logger = jest.fn();
    const schema_unit = new SchemaUnit({
      ...default_nishan_arg,
      cache,
      id: 'collection_1',
      schema_id: 'schema_id_1',
      logger
    });

    await schema_unit.delete();

    expect(logger).toHaveBeenCalledTimes(1);
    expect(logger).toHaveBeenCalledWith("DELETE", "collection", 'collection_1');

    expect(cache.collection.get('collection_1')?.schema).toStrictEqual({
      schema_id_2: tsu
    });

    expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
      o.c.u('collection_1', [], {
        schema: {
          schema_id_2: tsu
        }
      }),
    ])
  });

  it(`type=title`, async () => {
    const cache: ICache = {
      ...NotionCacheObject.createDefaultCache(),
      collection: new Map([
        [
          'collection_1',
          {
            schema: {
              schema_id_1: tsu
            }
          }
        ] as any
      ]),
    };

    const schema_unit = new SchemaUnit({
      ...default_nishan_arg,
      cache,
      id: 'collection_1',
      schema_id: 'schema_id_1',
    });

    await expect(()=>schema_unit.delete()).rejects.toThrow();
  });
})

describe('duplicate', () => {
  it(`type=text`, async () => {
    const collection_1: any = {
      schema: {
        text: txsu
      }
    }, cache: ICache = {
      ...NotionCacheObject.createDefaultCache(),
      collection: new Map([
        [
          'collection_1',
          collection_1
        ] as any
      ]),
    },
      executeOperationsMock = jest.spyOn(NotionOperationsObject, 'executeOperations').mockImplementation(async()=>undefined);

    const logger = jest.fn();
    const schema_unit = new SchemaUnit({
      ...default_nishan_arg,
      cache,
      id: 'collection_1',
      schema_id: 'text',
      logger
    });

    await schema_unit.duplicate();

    expect(Object.keys(collection_1.schema).length).toBe(2);
    expect(logger).toHaveBeenCalledTimes(1);
    expect(logger).toHaveBeenCalledWith("UPDATE", "collection", 'collection_1');
    expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
      o.c.u('collection_1', [], {schema: expect.objectContaining({
        text: txsu
      })})
    ]);
  });

  it(`type=title`, async () => {
    const collection_1: any = {
      schema: {
        schema_id_1: tsu
      }
    }, cache: ICache = {
      ...NotionCacheObject.createDefaultCache(),
      collection: new Map([
        [
          'collection_1',
          collection_1
        ] as any
      ]),
    };

    const schema_unit = new SchemaUnit({
      ...default_nishan_arg,
      cache,
      id: 'collection_1',
      schema_id: 'schema_id_1',
    });

    await expect(()=>schema_unit.duplicate()).rejects.toThrow();
  });
})

it(`getCachedChildData`, () => {
  const collection_1: any = {
    schema: {
      schema_id_1: tsu
    }
  }, cache: ICache = {
    ...NotionCacheObject.createDefaultCache(),
    collection: new Map([
      [
        'collection_1',
        collection_1
      ] as any
    ]),
  };

  const schema_unit = new SchemaUnit({
    ...default_nishan_arg,
    cache,
    id: 'collection_1',
    schema_id: 'schema_id_1',
  });

  expect(schema_unit.getCachedChildData()).toStrictEqual({
    type: 'title',
    name: 'Title'
  });
})