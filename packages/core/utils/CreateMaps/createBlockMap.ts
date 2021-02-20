import { IBlockMap } from '../../types';

/**
 * Returns an object with keys representing all the block types, and values containing a map of objects representing those block types
 */
export function createBlockMap () {
	return {
		linked_db: new Map(),
		collection_view_page: new Map(),
		embed: new Map(),
		video: new Map(),
		audio: new Map(),
		image: new Map(),
		bookmark: new Map(),
		code: new Map(),
		file: new Map(),
		tweet: new Map(),
		gist: new Map(),
		codepen: new Map(),
		maps: new Map(),
		figma: new Map(),
		drive: new Map(),
		text: new Map(),
		table_of_contents: new Map(),
		equation: new Map(),
		breadcrumb: new Map(),
		factory: new Map(),
		page: new Map(),
		to_do: new Map(),
		header: new Map(),
		sub_header: new Map(),
		sub_sub_header: new Map(),
		bulleted_list: new Map(),
		numbered_list: new Map(),
		toggle: new Map(),
		quote: new Map(),
		divider: new Map(),
		callout: new Map(),
		collection_view: new Map(),
		link_to_page: new Map(),
		column_list: new Map(),
		column: new Map()
	} as IBlockMap;
}