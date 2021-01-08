import { SelectOption } from '@nishans/types';

export default [
	{
		color: 'red',
		value: 'High'
	},
	{
		color: 'yellow',
		value: 'Medium'
	},
	{
		color: 'green',
		value: 'Low'
	}
] as (Omit<SelectOption, 'id'>)[];
