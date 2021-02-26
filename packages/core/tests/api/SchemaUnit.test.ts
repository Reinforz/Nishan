import { ICache, NotionCacheObject } from '@nishans/cache';
import { IOperation } from '@nishans/types';
import { SchemaUnit } from '../../libs';
import { default_nishan_arg, o } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`update`, () => {
  const cache: ICache = {
    ...NotionCacheObject.createDefaultCache(),
    collection: new Map([
      [
        'collection_1',
        {
          schema: {
            schema_id_1: {
              type: 'text',
              name: 'Text'
            }
          }
        }
      ] as any
    ]),
  },
    stack: IOperation[] = [];

  const logger = jest.fn();
  const schema_unit = new SchemaUnit({
    ...default_nishan_arg,
    cache,
    id: 'collection_1',
    schema_id: 'schema_id_1',
    stack,
    logger
  });

  schema_unit.update({
    type: 'text',
    name: 'New Name'
  });

  expect(logger).toHaveBeenCalledTimes(1);
  expect(logger).toHaveBeenCalledWith("UPDATE", "collection", 'collection_1');

  expect(cache.collection.get('collection_1')?.schema).toStrictEqual({
    schema_id_1: {
      type: 'text',
      name: 'New Name'
    }
  });

  expect(stack).toStrictEqual([
    o.c.u('collection_1', [], {
      schema: {
        schema_id_1: {
          type: 'text',
          name: 'New Name'
        }
      }
    }),
  ])
});

describe('delete', () => {
  it(`type=text`, () => {
    const cache: ICache = {
      ...NotionCacheObject.createDefaultCache(),
      collection: new Map([
        [
          'collection_1',
          {
            schema: {
              schema_id_1: {
                type: 'text',
                name: 'Text'
              },
              schema_id_2: {
                type: 'title',
                name: 'Title'
              }
            }
          }
        ] as any
      ]),
    },
      stack: IOperation[] = [];

    const logger = jest.fn();
    const schema_unit = new SchemaUnit({
      ...default_nishan_arg,
      cache,
      id: 'collection_1',
      schema_id: 'schema_id_1',
      stack,
      logger
    });

    schema_unit.delete();

    expect(logger).toHaveBeenCalledTimes(1);
    expect(logger).toHaveBeenCalledWith("DELETE", "collection", 'collection_1');

    expect(cache.collection.get('collection_1')?.schema).toStrictEqual({
      schema_id_2: {
        type: 'title',
        name: 'Title'
      }
    });

    expect(stack).toStrictEqual([
      o.c.u('collection_1', [], {
        schema: {
          schema_id_2: {
            type: 'title',
            name: 'Title'
          }
        }
      }),
    ])
  });

  it(`type=text`, () => {
    const cache: ICache = {
      ...NotionCacheObject.createDefaultCache(),
      collection: new Map([
        [
          'collection_1',
          {
            schema: {
              schema_id_1: {
                type: 'title',
                name: 'Title'
              }
            }
          }
        ] as any
      ]),
    },
      stack: IOperation[] = [];

    const logger = jest.fn();
    const schema_unit = new SchemaUnit({
      ...default_nishan_arg,
      cache,
      id: 'collection_1',
      schema_id: 'schema_id_1',
      stack,
      logger
    });

    schema_unit.delete();

    expect(logger).toHaveBeenCalledTimes(0);

    expect(cache.collection.get('collection_1')?.schema).toStrictEqual({
      schema_id_1: {
        type: 'title',
        name: 'Title'
      }
    });

    expect(stack).toStrictEqual([])
  });
})

describe('duplicate', () => {
  it(`type=text`, () => {
    const collection_1: any = {
      schema: {
        schema_id_1: {
          type: 'text',
          name: 'Text'
        }
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
      stack: IOperation[] = [];

    const logger = jest.fn();
    const schema_unit = new SchemaUnit({
      ...default_nishan_arg,
      cache,
      id: 'collection_1',
      schema_id: 'schema_id_1',
      stack,
      logger
    });

    schema_unit.duplicate();

    expect(Object.keys(collection_1.schema).length).toBe(2);
    expect(logger).toHaveBeenCalledTimes(1);
    expect(stack.length).toBe(1);
  });

  it(`type=title`, () => {
    const collection_1: any = {
      schema: {
        schema_id_1: {
          type: 'title',
          name: 'Title'
        }
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
      stack: IOperation[] = [];

    const logger = jest.fn();
    const schema_unit = new SchemaUnit({
      ...default_nishan_arg,
      cache,
      id: 'collection_1',
      schema_id: 'schema_id_1',
      stack,
      logger
    });

    schema_unit.duplicate();

    expect(Object.keys(collection_1.schema).length).toBe(1);
    expect(logger).toHaveBeenCalledTimes(0);
    expect(stack.length).toBe(0);
  });
})

it(`getCachedChildData`, () => {
  const collection_1: any = {
    schema: {
      schema_id_1: {
        type: 'title',
        name: 'Title'
      }
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
    stack: IOperation[] = [];

  const schema_unit = new SchemaUnit({
    ...default_nishan_arg,
    cache,
    id: 'collection_1',
    schema_id: 'schema_id_1',
    stack,
  });

  expect(schema_unit.getCachedChildData()).toStrictEqual({
    type: 'title',
    name: 'Title'
  });
})