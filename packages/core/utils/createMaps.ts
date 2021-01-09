import { ITBlock, ITView, ITSchemaUnit, ITPage } from '../types';

export function createBlockMap () {
	return {
		linked_db: [],
		collection_view_page: [],
		embed: [],
		video: [],
		audio: [],
		image: [],
		bookmark: [],
		code: [],
		file: [],
		tweet: [],
		gist: [],
		codepen: [],
		maps: [],
		figma: [],
		drive: [],
		text: [],
		table_of_contents: [],
		equation: [],
		breadcrumb: [],
		factory: [],
		page: [],
		to_do: [],
		header: [],
		sub_header: [],
		sub_sub_header: [],
		bulleted_list: [],
		numbered_list: [],
		toggle: [],
		quote: [],
		divider: [],
		callout: [],
		collection_view: [],
		link_to_page: [],
		column_list: [],
		column: []
	} as ITBlock;
}

export function createViewMap () {
	return {
		board: [],
		gallery: [],
		list: [],
		timeline: [],
		table: [],
		calendar: []
	} as ITView;
}

export function createSchemaUnitMap () {
	return {
		text: [],
		number: [],
		select: [],
		multi_select: [],
		title: [],
		date: [],
		person: [],
		file: [],
		checkbox: [],
		url: [],
		email: [],
		phone_number: [],
		formula: [],
		relation: [],
		rollup: [],
		created_time: [],
		created_by: [],
		last_edited_time: [],
		last_edited_by: []
	} as ITSchemaUnit;
}

export function createPageMap () {
	return {
		page: [],
		collection_view_page: []
	} as ITPage;
}
