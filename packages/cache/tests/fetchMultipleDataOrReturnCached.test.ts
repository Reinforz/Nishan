import { NotionEndpoints } from '@nishans/endpoints';
import { INotionCache } from '@nishans/types';
import { NotionCache } from '../libs';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('fetchMultipleDataOrReturnCached', () => {
  it(`works correctly`, async () => {
    const block_1 = {
        id: 'block_1'
      },
      block_2 = {
        id: 'block_2'
      },
      cache: INotionCache = {
        ...NotionCache.createDefaultCache(),
        block: new Map([['block_1', block_1]])
      } as any;
    const getRecordValuesMock = jest
      .spyOn(NotionEndpoints.Queries, 'getRecordValues')
      .mockImplementationOnce(async () => {
        return {
          recordMapWithRoles: {
            block: {
              block_2: {
                value: block_2
              }
            },
            space: {
              space_1: {
                value: {
                  id: 'space_1'
                }
              }
            }
          }
        } as any;
      });
    const result_record_map = await NotionCache.fetchMultipleDataOrReturnCached(
      [
        ['block_1', 'block'],
        ['block_2', 'block']
      ],
      { cache, token: 'token', user_id: 'user_root_1' }
    );
    expect(result_record_map.block[0]).toBe(block_1);
    expect(result_record_map.block[1]).toBe(block_2);
    expect(getRecordValuesMock.mock.calls[0][0]).toStrictEqual({
      requests: [
        {
          id: 'block_2',
          table: 'block',
          version: 0
        }
      ]
    });
    expect(getRecordValuesMock.mock.calls[0][1]).toStrictEqual(
      expect.objectContaining({
        token: 'token'
      })
    );
    expect(cache.block.get('block_1')).toStrictEqual(block_1);
    expect(cache.block.get('block_2')).toStrictEqual(block_2);
  });
});
