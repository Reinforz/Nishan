import { IOperation } from '@nishans/types';
import { NotionOperations } from '../../libs';
import { NotionOperationsPluginOptions } from '../../libs/Plugins/Options';

afterEach(() => {
  jest.restoreAllMocks();
});

it(`removeLastEditedPropsPlugin`, () => {
  const args = {
      last_edited_by_id: 'id',
      last_edited_time: Date.now(),
      last_edited_by_table: 'notion_user',
      other_data: 'data'
    },
    operation: IOperation = {
      args,
      command: 'update',
      path: [],
      pointer: {
        id: '123',
        table: 'block',
        spaceId: 'spaceId'
      }
    };

  const skipPluginOptionMock = jest
    .spyOn(NotionOperationsPluginOptions, 'skip')
    .mockImplementationOnce(() => operation);

  expect(
    NotionOperations.Plugin.removeLastEditedProps({
      skip: undefined
    })(operation)
  ).toStrictEqual({ ...operation, args: { other_data: 'data' } });
  expect(skipPluginOptionMock).toHaveBeenCalledWith(operation, undefined);
});
