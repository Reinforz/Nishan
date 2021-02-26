export interface IViewList {
	table: Array<[string, string]>;
	list: Array<[string, string]>;
	gallery: Array<[string, string]>;
	board: Array<[string, string]>;
	calendar: Array<[string, string]>;
	timeline: Array<[string, string]>;
}

export interface ISchemaUnitList {
	text: Array<[string, string]>;
	number: Array<[string, string]>;
	select: Array<[string, string]>;
	multi_select: Array<[string, string]>;
	title: Array<[string, string]>;
	date: Array<[string, string]>;
	person: Array<[string, string]>;
	file: Array<[string, string]>;
	checkbox: Array<[string, string]>;
	url: Array<[string, string]>;
	email: Array<[string, string]>;
	phone_number: Array<[string, string]>;
	formula: Array<[string, string]>;
	relation: Array<[string, string]>;
	rollup: Array<[string, string]>;
	created_time: Array<[string, string]>;
	created_by: Array<[string, string]>;
	last_edited_time: Array<[string, string]>;
	last_edited_by: Array<[string, string]>;
}
