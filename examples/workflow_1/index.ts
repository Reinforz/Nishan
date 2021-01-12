import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import Nishan, { CheckboxSchemaUnit, TFormulaCreateInput, TViewCreateInput, TViewSchemaUnitsCreateInput } from '@nishans/core';
import { status, phase, priority, subject, difficulty } from '../data';
import { counterFormula, threePropertiesAddition, twoPropertiesAddition } from '../util';

import '../env';

const daily_sites = [
	'Github',
	'Gmail',
	'Twitter',
	'Codepen',
	'Youtube',
	'Reddit',
	'Stack Overflow',
	'Hashnode',
	'Dev.to',
	'Medium',
	'Stackshare'
];

(async function () {
	const nishan = new Nishan({
		token: process.env.NOTION_TOKEN as string,
	});

	const user = await nishan.getNotionUser((user) => user.family_name === 'Shaheer');
	const space = await user.getSpace((space) => space.name === 'Developers');
	const { page } = await space.getTRootPage(
		(root_page) => root_page.type === 'page' && root_page.properties.title[0][0] === 'Hello'
  );
  const target_page = page.get("Hello");
	await target_page?.createBlocks([
		{
			type: 'page',
			properties: {
				title: [ [ 'Workflow 1' ] ]
			},
			contents: [
				{
					type: 'collection_view_page',
					properties: {
						title: [ [ 'Articles' ] ]
					},
					format: {
						page_full_width: true,
						page_icon: 'https://notion-emojis.s3-us-west-2.amazonaws.com/v0/svg-twitter/1f4d4.svg'
					},
					schema: [
						{ type: 'title', name: 'Title' },
						{
							type: 'multi_select',
							name: 'Subject',
							options: subject.map(({ title, color }) => ({ value: title, color, id: uuidv4() }))
						},
						{
							type: 'formula',
							name: 'Urgency',
							formula: threePropertiesAddition(['Phase Counter', 'Status Counter', 'Priority Counter'])
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
							name: 'Provider',
							options: []
						},
						{
							type: 'url',
							name: 'Source'
						},
						{
							type: 'select',
							name: 'Priority',
							options: priority.map((priority) => ({ ...priority, id: uuidv4() }))
						},
						{
							type: 'formula',
							name: 'Priority Counter',
							formula: counterFormula('priority', [ 'High', 'Medium' ])
						},
						{
							type: 'select',
							name: 'Status',
							options: status.map((status) => ({ ...status, id: uuidv4() }))
						},
						{
							type: 'formula',
							name: 'Status Counter',
							formula: counterFormula('status', [ 'Completing', 'To Complete' ])
						},
						{
							type: 'select',
							name: 'Phase',
							options: phase.map((phase) => ({ ...phase, id: uuidv4() }))
						},
						{
							type: 'formula',
							name: 'Phase Counter',
							formula: counterFormula('phase', [ 'Practice', 'Revise' ])
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
					],
					views: [
						...[
							[ 'To Complete', 'Learn' ],
							[ 'Completing', 'Learn' ],
							[ 'Completed', 'Learn' ],
							[ 'To Complete', 'Revise' ],
							[ 'Completing', 'Revise' ],
							[ 'Completed', 'Revise' ],
							[ 'To Complete', 'Practice' ],
							[ 'Completing', 'Practice' ],
							[ 'Completed', 'Practice' ]
						].map(([ status, phase ]) => {
							const data: TViewCreateInput = {
								name: `${status} ${phase} Articles`,
								type: 'table',
								schema_units: [
									{
										type: 'title',
										format: 300,
										name: 'Title',
										sort: 'ascending'
									},
									{
										type: 'formula',
										name: 'Urgency',
										sort: [ 'descending', 0 ],
										format: 50
									},
									{
										type: 'formula',
										name: 'Completed',
										format: 50
									},
									{
										type: 'multi_select',
										name: 'Subject',
										format: 150
									},
									{
										type: 'select',
										name: 'Provider',
										format: 100
									},
									{
										type: 'url',
										name: 'Source'
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
									}
								],
								filters: [
									{
										type: 'select',
										name: 'Phase',
										filter: {
											operator: 'enum_is',
											value: {
												type: 'exact',
												value: phase
											}
										}
									},
									{
										type: 'select',
										name: 'Status',
										filter: {
											operator: 'enum_is',
											value: {
												type: 'exact',
												value: status
											}
										}
									}
								]
							};
							return data;
						})
					]
				},
				{
					type: 'collection_view_page',
					properties: {
						title: [ [ 'Todo' ] ]
					},
					format: {
						page_full_width: true,
						page_icon: 'https://notion-emojis.s3-us-west-2.amazonaws.com/v0/svg-twitter/2611-fe0f.svg'
					},
					schema: [
						{
							type: 'title',
							name: 'Todo'
						},
						{
							type: 'formula',
							name: 'Urgency',
							formula: twoPropertiesAddition(['Difficulty Counter', 'Priority Counter'])
						},
						{
							type: 'formula',
							name: 'Done',
							formula: {
								function: 'not',
								args: {
									function: 'empty',
									args: { property: 'Completed At' }
								}
							}
						},
						{
							type: 'select',
							name: 'Priority',
							options: priority.map((priority) => ({ ...priority, id: uuidv4() }))
						},
						{
							type: 'select',
							name: 'Difficulty',
							options: difficulty.map((difficulty) => ({ ...difficulty, id: uuidv4() }))
						},
						{
							type: 'formula',
							name: 'Priority Counter',
							formula: counterFormula('priority', [ 'High', 'Medium' ])
						},
						{
							type: 'formula',
							name: 'Difficulty Counter',
							formula: counterFormula('difficulty', [ 'Easy', 'Medium' ])
						},
						{
							type: 'date',
							name: 'Completed At'
						}
					],
					views: [
						{
							name: 'Todo',
							type: 'table',
							schema_units: [
								{
									type: 'title',
									format: 350,
									name: 'Todo'
								},
								{
									type: 'select',
									name: 'Priority'
								},
								{
									type: 'select',
									name: 'Difficulty'
								},
								{
									type: 'date',
									name: 'Completed At'
								},
								{
									type: 'formula',
									name: 'Urgency',
									format: false,
									sort: 'descending'
								},
								{
									type: 'formula',
									name: 'Done',
									format: false
								}
							],
							filters: [
								{
									type: 'formula',
									name: 'Done',
									filter: {
										operator: 'checkbox_is',
										value: {
											type: 'exact',
											value: false
										}
									}
								}
							]
						},
						{
							name: 'Done',
							type: 'table',
							schema_units: [
								{
									type: 'title',
									format: 350,
									name: 'Todo'
								},
								{
									type: 'select',
									name: 'Priority'
								},
								{
									type: 'select',
									name: 'Difficulty'
								},
								{
									type: 'date',
									name: 'Completed At',
									format: 150,
									sort: 'descending'
								},
								{
									type: 'formula',
									name: 'Done',
									format: false
								}
							],
							filters: [
								{
									type: 'formula',
									name: 'Done',
									filter: { operator: 'checkbox_is', value: { type: 'exact', value: true } }
								}
							]
						}
					]
				},
				{
					type: 'collection_view_page',
					properties: {
						title: [ [ 'Daily' ] ]
					},
					format: {
						page_full_width: true
					},
					schema: [
						{
							type: 'title',
							name: 'Date'
						},
						{
							type: 'date',
							name: 'Created At'
						},
						...daily_sites.map((name) => ({ type: 'checkbox', name } as CheckboxSchemaUnit))
					],
					views: [
						{
							type: 'table',
							name: 'All',
							schema_units: [
								{
									type: 'title',
									name: 'Date',
									sort: 'descending',
									format: 150
								},
								...daily_sites.map((name) => ({ type: 'checkbox', name, format: 100 } as TViewSchemaUnitsCreateInput))
							]
						},
						{
							type: 'table',
							name: 'Today',
							schema_units: [
								{
									type: 'title',
									name: 'Date'
								},
								{
									type: 'date',
									name: 'Created At',
									sort: 'descending',
									format: false
								},
								...daily_sites.map((name) => ({ type: 'checkbox', name, format: 100 } as TViewSchemaUnitsCreateInput))
							],
							filters: [
								{
									type: 'date',
									name: 'Created At',
									filter: { operator: 'date_is', value: { value: 'today', type: 'relative' } }
								}
							]
						},
						{
							type: 'table',
							name: 'Yesterday',
							schema_units: [
								{
									type: 'title',
									name: 'Date'
								},
								{
									type: 'date',
									name: 'Created At',
									sort: 'descending',
									format: false
								},
								...daily_sites.map((name) => ({ type: 'checkbox', name, format: 100 } as TViewSchemaUnitsCreateInput))
							],
							filters: [
								{
									type: 'date',
									name: 'Created At',
									filter: { operator: 'date_is', value: { value: 'yesterday', type: 'relative' } }
								}
							]
						},
						{
							type: 'table',
							name: 'One Week Ago',
							schema_units: [
								{
									type: 'title',
									name: 'Date'
								},
								{
									type: 'date',
									name: 'Created At',
									sort: 'descending',
									format: false
								},
								...daily_sites.map((name) => ({ type: 'checkbox', name, format: 100 } as TViewSchemaUnitsCreateInput))
							],
							filters: [
								{
									type: 'date',
									name: 'Created At',
									filter: { operator: 'date_is', value: { value: 'one_week_ago', type: 'relative' } }
								}
							]
						}
					]
				}
			]
		}
  ]);
  // fs.writeFileSync(__dirname+"/data.json", JSON.stringify(target_page?.stack), 'utf-8');
	await target_page?.executeOperation();
})();
