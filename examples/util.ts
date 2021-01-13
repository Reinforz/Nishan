import {
	NumberAddFunctionCreateInput,
	TFormulaCreateInput,
	TSchemaUnitInput,
	TViewSchemaUnitsCreateInput
} from '@nishans/core';
import { status, phase, priority, subject } from './data';
import { v4 as uuidv4 } from 'uuid';

export function counterFormula (property: string, levels: [string, string]): TFormulaCreateInput {
	return {
		function: 'if',
		result_type: 'number',
		args: [
			{
				function: 'equal',
				args: [ { property }, levels[0] ]
			},
			3,
			{
				function: 'if',
				result_type: 'number',
				args: [
					{
						function: 'equal',
						args: [ { property }, levels[1] ]
					},
					2,
					1
				]
			}
		]
	};
}

export const threePropertiesAddition = (properties: [string, string, string]): NumberAddFunctionCreateInput => {
	return {
		function: 'add',
		result_type: 'number',
		args: [
			{ property: properties[0] },
			{
				function: 'add',
				result_type: 'number',
				args: [ { property: properties[1] }, { property: properties[2] } ]
			}
		]
	};
};

export const twoPropertiesAddition = (properties: [string, string]): NumberAddFunctionCreateInput => {
	return {
		function: 'add',
		result_type: 'number',
		args: [ { property: properties[0] }, { property: properties[1] } ]
	};
};

export const curriculumInfoSchemaUnits: TSchemaUnitInput[] = [
	{ type: 'title', name: 'Title' },
	{
		type: 'multi_select',
		name: 'Subject',
		options: subject.map(({ title, color }) => ({ value: title, color, id: uuidv4() }))
	},
	{
		type: 'formula',
		name: 'Urgency',
		formula: threePropertiesAddition([ 'Phase Counter', 'Status Counter', 'Priority Counter' ])
	},
	{
		type: 'formula',
		name: 'Completed',
		formula: {
			function: 'and',
			args: [
				{
					function: 'and',
					args: [ { property: 'Practiced' }, { property: 'Learned' } ]
				},
				{ property: 'Revised' }
			]
		}
	},
	{
		type: 'select',
		name: 'Priority',
		options: priority.map((priority) => ({ ...priority, id: uuidv4() }))
	},
	{
		type: 'formula',
		name: 'Priority Counter',
		formula: counterFormula('Priority', [ 'High', 'Medium' ])
	},
	{
		type: 'select',
		name: 'Status',
		options: status.map((status) => ({ ...status, id: uuidv4() }))
	},
	{
		type: 'formula',
		name: 'Status Counter',
		formula: counterFormula('Status', [ 'Completing', 'To Complete' ])
	},
	{
		type: 'select',
		name: 'Phase',
		options: phase.map((phase) => ({ ...phase, id: uuidv4() }))
	},
	{
		type: 'formula',
		name: 'Phase Counter',
		formula: counterFormula('Phase', [ 'Practice', 'Revise' ])
	},
	{
		type: 'date',
		name: 'Learn Range'
	},
	{
		type: 'checkbox',
		name: 'Learned'
	},
	{
		type: 'date',
		name: 'Revise Range'
	},
	{
		type: 'checkbox',
		name: 'Revised'
	},
	{
		type: 'date',
		name: 'Practice Range'
	},
	{
		type: 'checkbox',
		name: 'Practiced'
	}
];
