import { Schema } from '@nishans/types';
import { createViews, getSchemaMap, populateViewFormat, populateViewQuery2 } from '../../src';

const schema: Schema = {
	title: {
		type: 'title',
		name: 'Title'
	},
	number: {
		type: 'number',
		name: 'Number'
	},
	text: {
		type: 'text',
		name: 'Text'
	}
};

const schema_map = getSchemaMap(schema);

describe('populateViewQuery2', () => {
	it(`Should work for table view`, () => {
		const query2 = populateViewQuery2({
			type: 'timeline',
			name: 'Table'
		});
	});
});
