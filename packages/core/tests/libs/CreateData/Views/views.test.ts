import { NotionCacheObject } from '@nishans/cache';
import {
  IOperation, Schema
} from '@nishans/types';
import { v4 } from 'uuid';
import {
  CreateData
} from '../../../../libs/CreateData';
import { tsu } from "../utils";

afterEach(() => {
	jest.restoreAllMocks();
});

const default_nishan_arg = {
  token: 'token',
  user_id: 'user_id',
  space_id: 'space_id',
  shard_id: 123,
}

const default_collection = {
  id: 'collection_id',
  schema: {
    title: tsu
  } as Schema,
  parent_id: 'parent_id'
};

describe('Output correctly', () => {
  it(`Should work correctly`, () => {
    const id = v4(),
    stack: IOperation[] = [],
    cache = NotionCacheObject.createDefaultCache();
    
    CreateData.views(
      default_collection,
      [
        {
          id,
          type: 'table',
          name: 'Table',
          schema_units: [
            tsu
          ]
        }
      ],
      {
        ...default_nishan_arg,
        stack,
        cache,
        logger: ()=>{
          return
        },
      },
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
      default_collection,
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
        stack,
        cache,
        ...default_nishan_arg,
        logger: ()=>{
          return
        }
      }
    );
    
    expect(view_ids).toStrictEqual([ id ]);
    expect(view_map.table.get(id)?.getCachedData()).toStrictEqual(expected_view_data);
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
      }
    ]);
  });
});

describe('throws error', () => {
  it(`when unknown property is referenced`, () => {
    expect(()=>CreateData.views(
      default_collection,
      [
        {
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
        ...default_nishan_arg,
        stack: [],
        cache: NotionCacheObject.createDefaultCache(),
        logger: ()=>{
          return
        }
      }
    )).toThrow()
  });

  it(`empty input values`, () => {
    expect(()=>CreateData.views(
      default_collection,
      [],
      {
        ...default_nishan_arg,
        stack: [],
        cache: NotionCacheObject.createDefaultCache(),
        logger: ()=>{
          return
        }
      }
    )).toThrow(`input views array cannot be empty`)
  });
})

