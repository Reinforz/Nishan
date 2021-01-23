import { SelectOption } from '@nishans/types';

export default [
	{
		color: 'default',
		value: 'Learning'
	},
	{
		color: 'default',
		value: 'Practice'
	},
	{
		color: 'default',
		value: 'Project'
	},
	{
		color: 'default',
		value: 'Revise'
	},
	{
		color: 'default',
		value: 'Organization'
	},
	{
		color: 'default',
		value: 'Resources'
	},
	{
		color: 'default',
		value: 'Online'
	}
] as (Omit<SelectOption, 'id'>)[];
