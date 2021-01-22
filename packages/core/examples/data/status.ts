import { SelectOption } from '@nishans/types';

export default [
	{
		color: 'red',
		value: 'To Complete'
	},
	{
		color: 'yellow',
		value: 'Completing'
	},
	{
		color: 'green',
		value: 'Completed'
	}
] as (Omit<SelectOption, 'id'>)[];
