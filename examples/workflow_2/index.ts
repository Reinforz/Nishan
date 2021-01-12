import { v4 as uuidv4 } from 'uuid';
import '../env';
import Nishan, {
	FormulaSchemaUnitInput,
	RelationSchemaUnit,
	RollupSchemaUnit,
	slugify,
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
		name: 'Subject',
		format: 200
	},
	{
		type: 'multi_select',
		name: 'Source',
		format: 200
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
								property: `goal_${goal_number}_steps`
							},
							{
								function: 'toNumber',
								args: {
									property: `goal_${goal_number}_total_steps`
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
		tasks_collection_id = uuidv4();
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
							{
								type: 'formula',
								name: 'Progress',
								formula: {
									function: 'if',
									args: [
										{
											function: 'equal',
											args: [ { property: slugify('Total Steps') }, 0 ]
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
																property: 'completed_steps'
															},
															{
																property: 'total_steps'
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
							{
								type: 'formula',
								name: 'Completed Steps',
								formula: {
									function: 'add',
									args: [
										{ property: 'completed_steps_1' },
										{
											function: 'add',
											args: [ { property: 'completed_steps_2' }, { property: 'completed_steps_3' } ]
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
										{ property: 'total_tasks_1' },
										{
											function: 'add',
											args: [ { property: 'total_tasks_2' }, { property: 'total_tasks_3' } ]
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
						type: 'collection_view_page',
						properties: {
							title: [ [ 'Tasks' ] ]
						},
						collection_id: tasks_collection_id,
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
										type: 'relation',
										name: 'Goal 1',
										format: 100
									},
									{
										type: 'relation',
										name: 'Goal 2',
										format: 100
									},
									{
										type: 'relation',
										name: 'Goal 3',
										format: 100
									},
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
											args: { property: 'custom_date' }
										},
										{ property: 'created' },
										{ property: 'custom_date' }
									]
								}
							}
						]
					}
				]
			}
		]);

		const goals_cvp = collection_view_page.get(goals_cvp_id);
		if (goals_cvp) {
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
					goal2taskCompletedStepsRollup(3)
				]);
				// console.log(goals_collection.getCachedData().schema);
				await target_page.executeOperation();
			}
		}
	}
})();
