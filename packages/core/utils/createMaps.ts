import { ITBlock, ITView, ITSchemaUnit, ITPage } from '../types';

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
	} as ITBlock;
}

export function createViewMap () {
	return {
		board: new Map(),
		gallery: new Map(),
		list: new Map(),
		timeline: new Map(),
		table: new Map(),
		calendar: new Map()
	} as ITView;
}

export function createSchemaUnitMap () {
	return {
		text: new Map(),
		number: new Map(),
		select: new Map(),
		multi_select: new Map(),
		title: new Map(),
		date: new Map(),
		person: new Map(),
		file: new Map(),
		checkbox: new Map(),
		url: new Map(),
		email: new Map(),
		phone_number: new Map(),
		formula: new Map(),
		relation: new Map(),
		rollup: new Map(),
		created_time: new Map(),
		created_by: new Map(),
		last_edited_time: new Map(),
		last_edited_by: new Map()
	} as ITSchemaUnit;
}

export function createPageMap () {
	return {
		page: new Map(),
		collection_view_page: new Map()
	} as ITPage;
}
