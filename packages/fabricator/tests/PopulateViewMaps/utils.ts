import { Schema } from '@nishans/types';

export const schema: Schema = {
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

// title schema map unit
export const tsmu = {
	schema_id: 'title',
	name: 'Title',
	type: 'title'
};
