import { IOperation } from '@nishans/types';
import { NotionOperationsPluginOptions } from '../../../libs/Plugins/Options';

describe('NotionOperationsPluginOptions.skip', () => {
  const operation: IOperation = {
    args: {},
    command: 'update',
    path: [],
    pointer: {
      id: '123',
      table: 'block',
      spaceId: 'spaceId'
    }
  };

  it(`Should skip based on skip value`, () => {
    expect(
      NotionOperationsPluginOptions.skip(
        operation,
        (op) => op.pointer.id === '123'
      )
    ).toStrictEqual(operation);
  });

  it(`Should not skip based on skip value`, () => {
    expect(
      NotionOperationsPluginOptions.skip(
        operation,
        (op) => op.pointer.id === '1234'
      )
    ).toStrictEqual(undefined);
  });

  it(`Should not skip if skip option not provided`, () => {
    expect(NotionOperationsPluginOptions.skip(operation)).toStrictEqual(
      undefined
    );
  });
});
