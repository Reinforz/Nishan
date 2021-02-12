import {
	createBlockMap,
	createPageMap,
	createSchemaUnitMap,
	createViewMap,
	IBlockMap,
	IPageMap,
	ISchemaUnitMap,
	IViewMap
} from '../../src';

const block_map_keys: (keyof IBlockMap)[] = [
	'linked_db',
	'collection_view_page',
	'embed',
	'video',
	'audio',
	'image',
	'bookmark',
	'code',
	'file',
	'tweet',
	'gist',
	'codepen',
	'maps',
	'figma',
	'drive',
	'text',
	'table_of_contents',
	'equation',
	'breadcrumb',
	'factory',
	'page',
	'to_do',
	'header',
	'sub_header',
	'sub_sub_header',
	'bulleted_list',
	'numbered_list',
	'toggle',
	'quote',
	'divider',
	'callout',
	'collection_view',
	'link_to_page',
	'column_list',
	'column'
];

describe('createBlockMap', () => {
	const block_map = createBlockMap();

	it(`Should contain correct keys`, () => {
		block_map_keys.forEach((block_map_key) => expect(block_map[block_map_key]).toBeTruthy());
	});

	it(`Should contain correct value`, () => {
		block_map_keys.forEach((block_map_key) => expect(block_map[block_map_key] instanceof Map).toBe(true));
	});
});

const view_map_keys: (keyof IViewMap)[] = [ 'board', 'gallery', 'list', 'timeline', 'table', 'calendar' ];

describe('createViewMap', () => {
	const view_map = createViewMap();

	it(`Should contain correct keys`, () => {
		view_map_keys.forEach((view_map_key) => expect(view_map[view_map_key]).toBeTruthy());
	});

	it(`Should contain correct value`, () => {
		view_map_keys.forEach((view_map_key) => expect(view_map[view_map_key] instanceof Map).toBe(true));
	});
});

const schema_unit_map_keys: (keyof ISchemaUnitMap)[] = [
	'text',
	'number',
	'select',
	'multi_select',
	'title',
	'date',
	'person',
	'file',
	'checkbox',
	'url',
	'email',
	'phone_number',
	'formula',
	'relation',
	'rollup',
	'created_time',
	'created_by',
	'last_edited_time',
	'last_edited_by'
];

describe('createSchemaUnitMap', () => {
	const schema_unit_map = createSchemaUnitMap();

	it(`Should contain correct keys`, () => {
		schema_unit_map_keys.forEach((schema_unit_map_key) => expect(schema_unit_map[schema_unit_map_key]).toBeTruthy());
	});

	it(`Should contain correct value`, () => {
		schema_unit_map_keys.forEach((schema_unit_map_key) =>
			expect(schema_unit_map[schema_unit_map_key] instanceof Map).toBe(true)
		);
	});
});

const page_map_keys: (keyof IPageMap)[] = [ 'page', 'collection_view_page' ];

describe('createPageMap', () => {
	const page_map = createPageMap();

	it(`Should contain correct keys`, () => {
		page_map_keys.forEach((page_map_key) => expect(page_map[page_map_key]).toBeTruthy());
	});

	it(`Should contain correct value`, () => {
		page_map_keys.forEach((page_map_key) => expect(page_map[page_map_key] instanceof Map).toBe(true));
	});
});
