import { v4 as uuidv4 } from 'uuid';
import '../env';
import Nishan, {
	FormulaSchemaUnitInput,
	RelationSchemaUnit,
	RollupSchemaUnit,
	TSchemaUnitInput,
	TViewViewCreateInput
} from '@nishans/core';

import { status, purpose, subject, source } from '../data';
import { formulaUtil } from '../util';

const CommonMultiSelectSchemaInput: TSchemaUnitInput[] = [
	{
		type: 'multi_select',
		name: 'Purpose',
		options: purpose.map((purpose) => ({ ...purpose, id: uuidv4() }))
	},
	{
		type: 'multi_select',
		name: 'Subject',
		options: subject.map(({ title, color }) => ({ value: title, color, id: uuidv4() }))
	},
	{
		type: 'multi_select',
		name: 'Source',
		options: source.map((source) => ({ ...source, id: uuidv4() }))
	}
];

const CommonMultiSelectSchema: TViewViewCreateInput[] = [
	{
		type: 'multi_select',
		name: 'Purpose',
		format: 200
	},
	{
		type: 'multi_select',
		name: 'Purpose',
		format: 200
	},
	{
		type: 'multi_select',
		name: 'Purpose',
		format: 200
	}
];

function goalProgress (goal_number: number): FormulaSchemaUnitInput {
	return {
		type: 'formula',
		name: `Goal ${goal_number} Progress`,
		formula: [
			'round',
			[
				'multiple',
				[
					[
						'divide',
						[
							{ property: `Goal ${goal_number} Steps` },
							[ 'toNumber', { property: `Goal ${goal_number} Total Steps` } ]
						]
					],
					100
				]
			]
		]
	};
}

(async function () {
	const nishan = new Nishan({
		token: process.env.NOTION_TOKEN as string,
		defaultExecutionState: false
	});

	const user = await nishan.getNotionUser((user) => user.family_name === 'Shaheer');
	const space = await user.getSpace((space) => space.name === 'Developers');
	const { page: [ page ] } = await space.getTRootPage(
		(root_page) => root_page.type === 'page' && root_page.properties.title[0][0] === 'Hello'
	);
	const goals_collection_id = uuidv4();
	const goalRelation = (index: number): RelationSchemaUnit => {
		return {
			type: 'relation',
			collection_id: goals_collection_id,
			name: `Goal ${index}`,
			property: 'goal'
		};
	};

	const goalRollup = (index: number): RollupSchemaUnit => {
		return {
			collection_id: goals_collection_id,
			type: 'rollup',
			name: `Goal ${index} Total Steps`,
			aggregation: 'sum',
			relation_property: `goal_${index}`,
			target_property: 'total_steps',
			target_property_type: 'number'
		};
	};

	await page.createBlocks([
		{
			type: 'page',
			properties: {
				title: [ [ 'Workflow 1' ] ]
			},
			format: {
				page_full_width: true
			},
			contents: [
				{
					type: 'collection_view_page',
					properties: {
						title: [ [ 'Goals' ] ]
					},
					collection_id: goals_collection_id,
					views: [
						{
							type: 'table',
							name: 'Min Current',
							view: [
								{
									type: 'title',
									name: 'Goal',
									format: 300
								}
							]
						}
					],
					schema: [
						{
							type: 'created_time',
							name: 'Created'
						},
						/* {
							type: 'formula',
							name: 'Progress',
							formula: [
								'if',
								[
									[ 'equal', [ { property: 'Total Steps' }, 0 ] ],
									0,
									[
										'round',
										[
											'multiple',
											[ [ 'divide', [ { property: 'CS (Completed Steps)' }, { property: 'Total Steps' } ] ], 100 ]
										]
									]
								]
							]
						}, */
						...CommonMultiSelectSchemaInput,
						{
							type: 'select',
							name: 'Status',
							options: status.map((status) => ({ ...status, id: uuidv4() }))
						},
						{
							type: 'title',
							name: 'Goal'
						},
						{
							type: 'date',
							name: 'Completed At'
						},
						{
							type: 'number',
							name: 'Total Steps'
						},
						{
							type: 'formula',
							name: 'Status Counter',
							formula: formulaUtil('status', [ 'Completing', 'To Complete' ])
						}
					]
				},
				{
					type: 'collection_view_page',
					properties: {
						title: [ [ 'Tasks' ] ]
					},
					views: [
						{
							type: 'table',
							name: 'Today',
							view: [
								{
									type: 'formula',
									name: 'On'
								},
								{
									type: 'title',
									name: 'Task',
									format: 300
								},
								...CommonMultiSelectSchema,
								{
									type: 'number',
									name: 'Goal 1 Steps',
									format: 100
								},
								{
									type: 'number',
									name: 'Goal 2 Steps',
									format: 100
								},
								{
									type: 'number',
									name: 'Goal 3 Steps',
									format: 100
								},
								{
									type: 'number',
									name: 'Goal 1 Progress',
									format: 100
								},
								{
									type: 'number',
									name: 'Goal 2 Progress',
									format: 100
								},
								{
									type: 'number',
									name: 'Goal 3 Progress',
									format: 100
								}
							]
						}
					],
					schema: [
						{
							type: 'title',
							name: 'Task'
						},
						...CommonMultiSelectSchemaInput,
						goalProgress(1),
						goalProgress(2),
						goalProgress(3),
						goalRelation(1),
						goalRelation(2),
						goalRelation(3),
						goalRollup(1),
						goalRollup(2),
						goalRollup(3),
						{
							type: 'number',
							name: 'Goal 1 Steps'
						},
						{
							type: 'number',
							name: 'Goal 2 Steps'
						},
						{
							type: 'number',
							name: 'Goal 3 Steps'
						},
						{
							type: 'date',
							name: 'Custom Date'
						},
						{
							type: 'created_time',
							name: 'Created'
						},
						{
							type: 'formula',
							name: 'On',
							formula: [
								'if',
								[ [ 'empty', { property: 'custom_date' } ], { property: 'created' }, { property: 'custom_date' } ]
							]
						}
					]
				}
			]
		}
	]);

	await page.executeOperation();
})();
