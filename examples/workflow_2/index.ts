import { v4 as uuidv4 } from 'uuid';
import '../env';
import Nishan, {
	FormulaSchemaUnitInput,
	parseFormula,
	RelationSchemaUnit,
	RollupSchemaUnit,
	slugify,
	TSchemaUnitInput,
	TViewSchemaUnitsCreateInput
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

const CommonMultiSelectSchema: TViewSchemaUnitsCreateInput[] = [
	{
		type: 'multi_select',
		name: 'Purpose',
		format: 200,
		aggregation: 'unique'
	},
	{
		type: 'multi_select',
		name: 'Subject',
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

function goalProgress (goal_number: number): FormulaSchemaUnitInput {
	return {
		type: 'formula',
		name: `Goal ${goal_number} Progress`,
		formula: {
			function: 'round',
			args: {
				function: 'multiple',
				args: [
					{
						function: 'divide',
						args: [
							{
								property: `Goal ${goal_number} Step`
							},
							{
								function: 'toNumber',
								args: {
									property: `Goal ${goal_number} Total Steps`
								}
							}
						]
					},
					100
				]
			}
		}
	};
}

const goalViewItem = (index: number): TViewSchemaUnitsCreateInput[] => {
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

(async function () {
	const nishan = new Nishan({
		token: process.env.NOTION_TOKEN as string
	});

	const user = await nishan.getNotionUser((user) => user.family_name === 'Shaheer');
	const space = await user.getSpace((space) => space.name === 'Developers');
	const { page } = await space.getTRootPage(
		(root_page) => root_page.type === 'page' && root_page.properties.title[0][0] === 'Hello'
	);

	const target_page = page.get('Hello');

	const goals_collection_id = uuidv4(),
		goals_cvp_id = uuidv4(),
    tasks_collection_id = uuidv4(),
    tasks_cvp_id = uuidv4();

	const task2goalRelation = (index: number): RelationSchemaUnit => {
		return {
			type: 'relation',
			collection_id: goals_collection_id,
			name: `Goal ${index}`,
			property: `task_${index}`
		};
	};

	const task2goalRollup = (index: number): RollupSchemaUnit => {
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

	const goal2taskTotalTasksRollup = (index: number): RollupSchemaUnit => {
		return {
			collection_id: tasks_collection_id,
			type: 'rollup',
			name: `Total Tasks ${index}`,
			aggregation: 'count',
			relation_property: `task_${index}`,
			target_property: 'title',
			target_property_type: 'number'
		};
	};

	const goal2taskCompletedStepsRollup = (index: number): RollupSchemaUnit => {
		return {
			collection_id: tasks_collection_id,
			type: 'rollup',
			name: `Completed Steps ${index}`,
			aggregation: 'sum',
			relation_property: `task_${index}`,
			target_property: `goal_${index}_steps`,
			target_property_type: 'number'
		};
	};

	if (target_page) {
		const { collection_view_page } = await target_page.createBlocks([
			{
				type: 'page',
				properties: {
					title: [ [ 'Workflow 2' ] ]
				},
				format: {
					page_full_width: true
				},
				contents: [
					{
						id: goals_cvp_id,
						type: 'collection_view_page',
						properties: {
							title: [ [ 'Goals' ] ]
						},
						collection_id: goals_collection_id,
						views: [
							{
								type: 'table',
								name: 'Min Current',
								schema_units: [
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
							{
								type: 'formula',
								name: 'Progress',
								formula: {
									function: 'if',
									args: [
										{
											function: 'equal',
											args: [ { property: 'Total Steps' }, 0 ]
										},
										0,
										{
											function: 'round',
											args: {
												function: 'multiple',
												args: [
													{
														function: 'divide',
														args: [
															{
																property: 'Completed Steps'
															},
															{
																property: 'Total Steps'
															}
														]
													},
													100
												]
											}
										}
									]
								}
							},
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
            id: tasks_cvp_id,
						type: 'collection_view_page',
						properties: {
							title: [ [ 'Tasks' ] ]
						},
						collection_id: tasks_collection_id,
						views: [
							{
								type: 'table',
								name: 'Today',
								schema_units: [
									{
										type: 'formula',
										name: 'On'
									},
									{
										type: 'title',
										name: 'Task',
										format: 300,
										aggregation: 'count'
									},
									...CommonMultiSelectSchema,
									...goalViewItem(1),
									...goalViewItem(2),
									...goalViewItem(3)
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
							task2goalRelation(1),
							task2goalRelation(2),
							task2goalRelation(3),
							task2goalRollup(1),
							task2goalRollup(2),
							task2goalRollup(3),
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
								formula: {
									function: 'if',
									args: [
										{
											function: 'empty',
											args: { property: 'Custom Date' }
										},
										{ property: 'Created' },
										{ property: 'Custom Date' }
									]
								}
							}
						]
					}
				]
			}
		]);

    const goals_cvp = collection_view_page.get(goals_cvp_id),
      tasks_cvp = collection_view_page.get(tasks_cvp_id);
    if(tasks_cvp){
      const {table} = await tasks_cvp.getViews();
      const today_table = table.get("Today");
      console.log(JSON.stringify(today_table?.getCachedData().format.table_properties, null, 2))
    }

		/* if (goals_cvp) {
			const goals_collection = await goals_cvp.getCollection();
			if (goals_collection) {
				await goals_collection.updateSchemaUnits((schema_unit) => {
					switch (schema_unit.property) {
						case 'task_1':
							return { name: 'Task 1' };
						case 'task_2':
							return { name: 'Task 2' };
						case 'task_3':
							return { name: 'Task 3' };
						default:
							false;
					}
				});

				goals_collection.createSchemaUnits([
					goal2taskTotalTasksRollup(1),
					goal2taskTotalTasksRollup(2),
					goal2taskTotalTasksRollup(3),
					goal2taskCompletedStepsRollup(1),
					goal2taskCompletedStepsRollup(2),
					goal2taskCompletedStepsRollup(3),
					{
						type: 'formula',
						name: 'Completed Steps',
						formula: {
							function: 'add',
							args: [
								{ property: 'Completed Steps 1' },
								{
									function: 'add',
									args: [ { property: 'Completed Steps 2' }, { property: 'Completed Steps 3' } ]
								}
							]
						}
					},
					{
						type: 'formula',
						name: 'Total Tasks',
						formula: {
							function: 'add',
							args: [
								{ property: 'Total Tasks 1' },
								{
									function: 'add',
									args: [ { property: 'Total Tasks 2' }, { property: 'Total Tasks 3' } ]
								}
							]
						}
					}
				]);
				await target_page.executeOperation();
			}
		} */
	}
})();
