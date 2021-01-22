import {
	NumberAddFunctionCreateInput,
	NumberIfFunctionCreateInput,
	TFormulaCreateInput,
	TNumberResultType,
	TSchemaUnitInput,
	TViewSchemaUnitsCreateInput
} from '../Nishan';
import { status, phase, priority, subject } from './data';
import { v4 as uuidv4 } from 'uuid';

export const status_phase_combos = [
	[ 'To Complete', 'Learn', 'Learning' ],
	[ 'Completing', 'Learn', 'Learning' ],
	[ 'Completed', 'Learn', 'Learning' ],
	[ 'Completing', 'Revise', 'Revising' ],
	[ 'Completed', 'Revise', 'Revising' ],
	[ 'Completing', 'Practice', 'Practicing' ],
	[ 'Completed', 'Practice', 'Practicing' ]
];

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

export function adders (args: TNumberResultType[]) {
	const root_formula: NumberAddFunctionCreateInput = {
		function: 'add',
		result_type: 'number',
		args: [] as any
	};

	function inner (parent: any, arg_number: number) {
		if (arg_number < args.length - 1) {
			const root_formula: NumberAddFunctionCreateInput = {
				function: 'add',
				result_type: 'number',
				args: [] as any
			};
			const last_argument = arg_number === args.length - 2;
			parent.push(args[arg_number], last_argument ? args[arg_number + 1] : root_formula);
			if (!last_argument) inner(last_argument ? parent : root_formula.args, arg_number + 1);
		} else parent.push(args[arg_number]);
	}

	inner(root_formula.args, 0);

	return root_formula;
}

export function propertyChecked (property: string): NumberIfFunctionCreateInput {
	return {
		function: 'if',
		result_type: 'number',
		args: [
			{
				property
			},
			1,
			0
		]
	};
}

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
		formula: adders([ { property: 'Phase Counter' }, { property: 'Status Counter' }, { property: 'Priority Counter' } ])
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

export const CommonMultiSelectSchema: TViewSchemaUnitsCreateInput[] = [
	{
		type: 'multi_select',
		name: 'Subject',
		format: 200,
		aggregation: 'unique'
	},
	{
		type: 'multi_select',
		name: 'Purpose',
		format: 200,
		aggregation: 'unique'
	},
	{
		type: 'multi_select',
		name: 'Source',
		format: 200,
		aggregation: 'unique'
	}
];

export const goalViewItem = (index: number): TViewSchemaUnitsCreateInput[] => {
	return [
		{
			type: 'relation',
			name: `Goal ${index}`,
			format: true
		},
		{
			type: 'number',
			name: `Goal ${index} Steps`,
			format: 100,
			aggregation: 'sum'
		},
		{
			type: 'number',
			name: `Goal ${index} Progress`,
			format: 100,
			aggregation: 'sum'
		}
	];
};
