import { CreateMaps, IBlockMap } from '../../libs';

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
	'column_list',
	'column'
];

const block_map = CreateMaps.block();

it(`Should contain correct keys and value`, () => {
	block_map_keys.forEach((block_map_key) => expect(block_map[block_map_key] instanceof Map).toBe(true));
});
