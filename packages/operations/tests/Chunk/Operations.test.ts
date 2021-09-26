import { NotionOperations } from '../../libs';

describe('Operation', () => {
  it(`Should return correct operation`, () => {
    expect(
      NotionOperations.Chunk.block.update('123', 'spaceId', ['pages'], {})
    ).toStrictEqual({
      pointer: {
        table: 'block',
        id: '123',
        spaceId: 'spaceId'
      },
      path: ['pages'],
      command: 'update',
      args: {}
    });
  });
});
