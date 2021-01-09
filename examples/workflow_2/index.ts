import { v4 as uuidv4 } from 'uuid';
import '../env';
import Nishan from '@nishans/core';
import { status, purpose, subject, source } from '../data';
import { formulaUtil } from '../util';

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
						},
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
				}
			]
		}
	]);

	await page.executeOperation();
})();
