import { IOperation } from '@nishans/types';
import { NotionOperations } from '../libs';
import { operation } from './utils';

it(`applyPluginsToOperationsStack`, () => {
	const stack: IOperation[] = [
		operation,
		{
			args: {
				last_edited_time: Date.now(),
				last_edited_by_id: 'id',
				last_edited_by_table: 'notion_user',
				other_data: 'other data'
			},
			command: 'update',
			path: [],
			pointer: {
				id: 'id',
				table: 'block'
			}
		},
		{
			args: {
				last_edited_time: Date.now(),
				last_edited_by_id: 'id',
				last_edited_by_table: 'notion_user'
			},
			command: 'update',
			path: [],
			pointer: {
				id: 'id',
				table: 'block'
			}
		}
	];

	const updated_operations = NotionOperations.applyPluginsToOperationsStack(stack, [
		NotionOperations.Plugin.removeLastEditedProps(),
		NotionOperations.Plugin.removeEmptyOperations()
	]);

	expect(updated_operations).toStrictEqual([
		{
			args: {
				other_data: 'other data'
			},
			command: 'update',
			path: [],
			pointer: {
				id: 'id',
				table: 'block'
			}
		}
	]);
});
