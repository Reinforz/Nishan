import { DateViewFiltersValue, RelationSchemaUnit, RollupSchemaUnit } from '@nishans/types';
import { v4 as uuidv4 } from 'uuid';
import { Page, TFormulaSchemaUnitInput, TSchemaUnitInput, TViewCreateInput } from '../../../src';
import { purpose, source, status, subject } from '../data';
import { adders, CommonMultiSelectSchema, counterFormula, curriculumInfoSchemaUnits, goalViewItem } from '../util';

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

function goalProgress (goal_number: number): TFormulaSchemaUnitInput {
	return {
		type: 'formula',
		name: `Goal ${goal_number} Progress`,
		formula: [
			{
				function: 'round',
				args: [
					{
						function: 'multiply',
						args: [
							{
								function: 'divide',
								args: [
									{
										property: `Goal ${goal_number} Steps`
									},
									{
										function: 'toNumber',
										args: [
											{
												property: `Goal ${goal_number} Total Steps`
											}
										]
									}
								]
							},
							100
						]
					}
				]
			},
			'object'
		]
	};
}

export const tasksTableViews = (name: string, value: DateViewFiltersValue): TViewCreateInput => {
	return {
		type: 'table',
		name,
		schema_units: [
			{
				type: 'formula',
				name: 'On',
				sort: 'descending'
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
		],
		filters: [
			{
				type: 'formula',
				name: 'On',
				filter: {
					operator: 'date_is',
					value: {
						value,
						type: 'relative'
					}
				}
			}
		]
	};
};

const tasksBoardViews = (name: string): TViewCreateInput => {
	return {
		type: 'board',
		name,
		board_cover_size: 'medium',
		group_by: name,
		schema_units: [
			{
				type: 'title',
				name: 'Task',
				format: 300,
				aggregation: 'count'
			},
			{
				type: 'formula',
				name: 'On',
				sort: 'descending'
			},
			...CommonMultiSelectSchema
		]
	};
};

export default async function step2 (target_page: Page) {
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
				type: 'collection_view_page',
				name: [ [ 'Reading List' ] ],
				icon: 'https://notion-emojis.s3-us-west-2.amazonaws.com/v0/svg-twitter/1f4da.svg',
				views: [
					{
						type: 'gallery',
						name: 'All Books',
						gallery_cover_size: 'large',
						gallery_cover: { type: 'property', property: 'cover' },
						schema_units: [
							{
								type: 'title',
								name: 'Title',
								sort: 'ascending'
							},
							{
								type: 'multi_select',
								name: 'Publisher'
							},
							{
								type: 'text',
								name: 'Instructor'
							},
							{
								type: 'multi_select',
								name: 'Subject',
								format: 200,
								aggregation: 'unique'
							},
							{
								type: 'select',
								name: 'Priority',
								format: 100
							},
							{
								type: 'select',
								name: 'Status',
								format: 100
							},
							{
								type: 'select',
								name: 'Phase',
								format: 100
							},
							{
								type: 'formula',
								name: 'Urgency',
								sort: 'descending',
								format: false
							}
						]
					}
				],
				schema: [
					{
						type: 'multi_select',
						name: 'Publisher',
						options: []
					},
					{
						type: 'text',
						name: 'Instructor'
					},
					{
						type: 'file',
						name: 'Cover'
					},
					{
						type: 'url',
						name: 'Source'
					},
					...curriculumInfoSchemaUnits,
					{
						type: 'number',
						name: 'Pages'
					},
					{
						type: 'number',
						name: 'Chapters'
					}
				]
			},
			{
				type: 'collection_view_page',
				name: [ [ 'Course List' ] ],
				icon: 'https://notion-emojis.s3-us-west-2.amazonaws.com/v0/svg-twitter/1f4dd.svg',
				views: [
					{
						type: 'gallery',
						name: 'All Books',
						gallery_cover_size: 'large',
						gallery_cover: { type: 'property', property: 'cover' },
						schema_units: [
							{
								type: 'title',
								name: 'Title',
								sort: 'ascending'
							},
							{
								type: 'multi_select',
								name: 'Publisher'
							},
							{
								type: 'text',
								name: 'Instructor'
							},
							{
								type: 'multi_select',
								name: 'Subject',
								format: 200,
								aggregation: 'unique'
							},
							{
								type: 'select',
								name: 'Priority',
								format: 100
							},
							{
								type: 'select',
								name: 'Status',
								format: 100
							},
							{
								type: 'select',
								name: 'Phase',
								format: 100
							},
							{
								type: 'formula',
								name: 'Urgency',
								sort: 'descending',
								format: false
							}
						]
					}
				],
				schema: [
					{
						type: 'multi_select',
						name: 'Publisher',
						options: []
					},
					{
						type: 'text',
						name: 'Instructor'
					},
					{
						type: 'file',
						name: 'Cover'
					},
					{
						type: 'url',
						name: 'Source'
					},
					...curriculumInfoSchemaUnits,
					{
						type: 'number',
						name: 'Videos'
					},
					{
						type: 'number',
						name: 'Duration'
					},
					{
						type: 'number',
						name: 'Chapters'
					}
				]
			},
			{
				id: goals_cvp_id,
				type: 'collection_view_page',
				name: [ [ 'Goals' ] ],
				icon: 'https://notion-emojis.s3-us-west-2.amazonaws.com/v0/svg-twitter/1f44a-1f3fc.svg',
				collection_id: goals_collection_id,
				views: [
					{
						type: 'table',
						name: 'Current Minimalistic',
						schema_units: [
							// Progress schema_unit was referenced later
							/* {
								type: 'formula',
								name: 'Progress',
								format: 150,
								aggregation: 'average',
								sort: 'descending'
							}, */
							{
								type: 'title',
								name: 'Goal',
								format: 300,
								aggregation: 'count'
							},
							...CommonMultiSelectSchema
						],
						filters: [
							{
								type: 'select',
								name: 'Status',
								filter: {
									operator: 'enum_is',
									value: {
										type: 'exact',
										value: 'Completing'
									}
								}
							}
						]
					},
					{
						type: 'table',
						name: 'Completed',
						schema_units: [
							{
								type: 'date',
								name: 'Completed At',
								sort: 'descending',
								format: 200
							},
							{
								type: 'title',
								name: 'Goal',
								format: 300,
								aggregation: 'count'
							},
							...CommonMultiSelectSchema
						],
						filters: [
							{
								type: 'select',
								name: 'Status',
								filter: {
									operator: 'enum_is',
									value: {
										type: 'exact',
										value: 'Completed'
									}
								}
							}
							/* {
								type: 'formula',
								name: 'Progress',
								filter: {
									operator: 'number_less_than',
									value: {
										type: 'exact',
										value: 100
									}
								}
							} */
						]
					}
				],
				schema: [
					{
						type: 'created_time',
						name: 'Created'
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
						formula: counterFormula('Status', [ 'Completing', 'To Complete' ])
					}
				]
			},
			{
				id: tasks_cvp_id,
				type: 'collection_view_page',
				name: [ [ 'Tasks' ] ],
				icon: 'https://notion-emojis.s3-us-west-2.amazonaws.com/v0/svg-twitter/1f446-1f3fc.svg',
				collection_id: tasks_collection_id,
				schema: [
					{
						type: 'title',
						name: 'Task'
					},
					...CommonMultiSelectSchemaInput,

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
						formula: [
							{
								function: 'if',
								args: [
									{
										function: 'empty',
										args: [ { property: 'Custom Date' } ]
									},
									{ property: 'Created' },
									{ property: 'Custom Date' }
								]
							},
							'object'
						]
					},
					goalProgress(1),
					goalProgress(2),
					goalProgress(3)
				],
				views: [
					tasksTableViews('Today', 'today'),
					tasksTableViews('Yesterday', 'yesterday'),
					tasksTableViews('Weekly', 'one_week_ago'),
					tasksBoardViews('Purpose'),
					tasksBoardViews('Subject'),
					{
						type: 'calendar',
						name: 'Monthly Calendar',
						calendar_by: 'On',
						schema_units: [
							{
								type: 'multi_select',
								name: 'Purpose'
							},
							{
								type: 'multi_select',
								name: 'Subject'
							},
							{
								type: 'formula',
								name: 'On',
								sort: 'ascending',
								format: false
							}
						]
					}
				]
			}
		]);

		const goals_cvp = collection_view_page.get(goals_cvp_id),
			tasks_cvp = collection_view_page.get(tasks_cvp_id);
		if (goals_cvp) {
			const goals_collection = await goals_cvp.getCollection();
			if (goals_collection) {
				await goals_collection.updateSchemaUnits((schema_unit) => {
					switch (schema_unit.schema_id) {
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
					goal2taskCompletedStepsRollup(1),
					goal2taskCompletedStepsRollup(2),
					goal2taskCompletedStepsRollup(3),
					goal2taskTotalTasksRollup(1),
					goal2taskTotalTasksRollup(2),
					goal2taskTotalTasksRollup(3),
					{
						type: 'formula',
						name: 'Completed Steps',
						formula: adders([
							{ property: 'Completed Steps 1' },
							{ property: 'Completed Steps 2' },
							{ property: 'Completed Steps 3' }
						])
					},
					{
						type: 'formula',
						name: 'Total Tasks',
						formula: adders([
							{ property: 'Total Tasks 1' },
							{ property: 'Total Tasks 2' },
							{ property: 'Total Tasks 3' }
						])
					},
					{
						type: 'formula',
						name: 'Progress',
						formula: [
							{
								function: 'if',
								args: [
									{
										function: 'equal',
										args: [ { property: 'Total Steps' }, 0 ]
									},
									0,
									{
										function: 'round',
										args: [
											{
												function: 'multiply',
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
										]
									}
								]
							},
							'object'
						]
					}
				]);
				// fs.writeFileSync(__dirname+"/data.json", JSON.stringify(target_page?.stack), 'utf-8');
				await target_page.Operations.executeOperation();
			}
		}
	}
}
