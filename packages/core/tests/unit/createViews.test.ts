import { Schema } from '@nishans/types';
import { createViews, getSchemaMap, populateViewFormat } from '../../src';

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
		const { properties, format } = populateViewQuery2('table');
	});
});
