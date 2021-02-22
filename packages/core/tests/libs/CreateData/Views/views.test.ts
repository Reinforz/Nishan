import { ICache } from '@nishans/cache';
import {
  IOperation
} from '@nishans/types';
import { v4 } from 'uuid';
import {
  CreateData
} from '../../../../libs/CreateData';
import { createDefaultCache } from '../../../utils/createDefaultCache';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('CreateData.views', () => {
	describe('Output correctly', () => {
    it(`Should work correctly`, () => {
      const id = v4(),
      stack: IOperation[] = [],
      cache: ICache = createDefaultCache();
      
      CreateData.views(
        {
          id: 'collection_id',
          schema: {
            title: {
              type: "title",
              name: "Title"
            }
          },
          parent_id: 'collection_parent_id'
        },
        [
          {
            id,
            type: 'table',
            name: 'Table',
            schema_units: [
              {
                name: "Title",
                type: "title",
              }
            ]
          }
        ],
        {
          token: 'token',
          user_id: 'user_id',
          stack,
          cache,
          space_id: 'space_id',
          shard_id: 123,
          logger: ()=>{
            return
          }
        },
        'parent_id'
      );

      
      const expected_view_data = {
        id,
        "version": 0,
        "type": "table",
        "name": "Table",
        "page_sort": [],
        "parent_id": "parent_id",       
        "parent_table": "block",        
        "alive": true,
        "format": {
          "table_properties": [
            {
              "property": "title",      
              "visible": true,
              "width": 250
            }
          ],
          "table_wrap": false
        },
        "query2": {
          "aggregations": [],
          "sort": [],
          "filter": {
            "operator": "and",
            "filters": [{
              property: "title",
              filter: {
                operator: "string_is",
                value: {
                  type: "exact",
                  value: "123"
                }
              }
            }]
          }
        },
        "shard_id": 123,
        "space_id": "space_id"
      };
  
      const [ view_ids, view_map ] = CreateData.views(
        {
          id: 'collection_id',
          schema: {
            title: {
              type: "title",
              name: "Title"
            }
          },
          parent_id: 'parent_id'
        },
        [
          {
            id,
            type: 'table',
            name: 'Table',
            schema_units: [
              {
                name: "Title",
                type: "title",
              }
            ],
            filters: [
              {
                name: "Title",
                type: "title",
                filter: {
                  operator: "string_is",
                  value: {
                    type: "exact",
                    value: "123"
                  }
                }
              }
            ]
          }
        ],
        {
          token: 'token',
          user_id: 'user_id',
          stack,
          cache,
          space_id: 'space_id',
          shard_id: 123,
          logger: ()=>{
            return
          }
        }
      );
      
      expect(view_ids).toStrictEqual([ id ]);
      expect(view_map.table.get(id)?.getCachedData()).toStrictEqual(expected_view_data);
      expect(cache.collection_view.get(id)).toStrictEqual(expected_view_data);
      expect(
        stack
      ).toStrictEqual([
        {
          "path": [],
          "table": "collection_view",
          "command": "update",
          "args": {
            "id": expect.any(String),
            "version": 0,
            "type": "table",
            "name": "Table",
            "page_sort": [],
            "parent_id": "parent_id",
            "parent_table": "block",
            "alive": true,
            "format": {
              "table_properties": [
                {
                  "property": "title",
                  "visible": true,
                  "width": 250
                }
              ],
              "table_wrap": false
            },
            "query2": {
              "aggregations": [],
              "sort": [],
              "filter": {
                "operator": "and",
                "filters": []
              }
            },
            "shard_id": 123,
            "space_id": "space_id"
          },
          "id": expect.any(String)
        },
        {
          "path": [],
          "table": "collection_view",
          "command": "update",
          "args": {
            "id": expect.any(String),
            "version": 0,
            "type": "table",
            "name": "Table",
            "page_sort": [],
            "parent_id": "parent_id",
            "parent_table": "block",
            "alive": true,
            "format": {
              "table_properties": [
                {
                  "property": "title",
                  "visible": true,
                  "width": 250
                }
              ],
              "table_wrap": false
            },
            "query2": {
              "aggregations": [],
              "sort": [],
              "filter": {
                "operator": "and",
                "filters": [
                  {
                    "property": "title",
                    "filter": {
                      "operator": "string_is",
                      "value": {
                        "type": "exact",
                        "value": "123"
                      }
                    }
                  }
                ]
              }
            },
            "shard_id": 123,
            "space_id": "space_id"
          },
          "id": expect.any(String)
        }
      ]);
    });
  });

  it(`Throw error`, () => {
    const id = v4(),
      stack: IOperation[] = [],
      cache = createDefaultCache();
    expect(()=>CreateData.views(
      {
        id: 'collection_id',
        schema: {
          title: {
            type: "title",
            name: "Title"
          }
        },
        parent_id: 'parent_id'
      },
      [
        {
          id,
          type: 'table',
          name: 'Table',
          schema_units: [
            {
              name: "URL",
              type: "url",
            }
          ]
        }
      ],
      {
        token: 'token',
        user_id: 'user_id',
        stack,
        cache,
        space_id: 'space_id',
        shard_id: 123,
        logger: ()=>{
          return
        }
      }
    )).toThrow()
  });
});
