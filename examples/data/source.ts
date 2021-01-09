import { SelectOption } from '../../packages/core/dist/Nishan';

export default [
	{
		color: 'default',
		value: 'EBook'
	},
	{
		color: 'default',
		value: 'Course'
	},
	{
		color: 'default',
		value: 'Github'
	},
	{
		color: 'default',
		value: 'Docs'
	},
	{
		color: 'default',
		value: 'Local'
	},
	{
		color: 'default',
		value: 'Web'
	}
] as (Omit<SelectOption, 'id'>)[];
