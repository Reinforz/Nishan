import { IOperation } from '@nishans/types';
import { NotionOperationsPlugin } from '../../../src';
import { NotionOperationsPluginOptions } from '../../../src/Plugins/Options';

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
			id: '123',
			path: [],
			table: 'block'
		};

	const skipPluginOptionMock = jest
		.spyOn(NotionOperationsPluginOptions, 'skip')
		.mockImplementationOnce(() => operation);

	expect(
		NotionOperationsPlugin.removeLastEditedProps({
			skip: undefined
		})(operation)
	).toStrictEqual({ ...operation, args: { other_data: 'data' } });
	expect(skipPluginOptionMock).toHaveBeenCalledWith(operation, undefined);
});
