import { IOperation } from '@nishans/types';
import { removeLastEditedPropsPlugin } from '../../../src';

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

	expect(removeLastEditedPropsPlugin()(operation)).toStrictEqual({ ...operation, args: { other_data: 'data' } });
});
