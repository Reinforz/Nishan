import { IViewFilter, NotionNode, ParentProps, SpaceShardProps, ViewAggregations } from './';

export type TViewType = 'table' | 'list' | 'board' | 'gallery' | 'calendar' | 'timeline';
export type TViewFormatCover = { type: 'page_content' | 'page_cover' } | { type: 'property'; property: string };

export type TView = ITableView | IListView | IBoardView | IGalleryView | ICalendarView | ITimelineView;
export type TViewUpdateInput = Partial<TView>;
export type ICollectionLoadLimit =
	| { type: 'load_all' }
	| {
			type: 'load_limit';
			limit: 10 | 25 | 50 | 100;
		};
export interface IViewQuery2 {
	aggregations: ViewAggregations[];
	sort: ViewSorts[];
	filter: IViewFilter;
}

export type TViewQuery2 =
	| ITableViewQuery2
	| IListViewQuery2
	| IBoardViewQuery2
	| ICalendarViewQuery2
	| IGalleryViewQuery2
	| ITimelineViewQuery2;
export interface ITableViewFormat {
	table_wrap: boolean;
	table_properties: (ViewFormatProperties & { width: number })[];
	inline_collection_first_load_limit: ICollectionLoadLimit;
}

export type ITableViewQuery2 = Partial<IViewQuery2>;
export interface ITableView extends NotionNode, ParentProps, SpaceShardProps {
	name: string;
	type: 'table';
	page_sort: string[];
	format: ITableViewFormat;
	query2?: ITableViewQuery2;
}

export interface IListViewFormat {
	list_properties: ViewFormatProperties[];
	inline_collection_first_load_limit: ICollectionLoadLimit;
}

export type IListViewQuery2 = Partial<Omit<IViewQuery2, 'aggregations'>>;
export interface IListView extends NotionNode, ParentProps, SpaceShardProps {
	name: string;
	type: 'list';
	format: IListViewFormat;
	query2?: IListViewQuery2;
}

export interface IBoardViewFormat {
	board_cover: TViewFormatCover;
	board_cover_aspect?: 'contain' | 'cover';
	board_cover_size?: 'small' | 'medium' | 'large';
	board_groups2: { hidden: boolean; property: string; value: { type: 'select' | 'multi_select'; value?: string } }[];
	board_properties: ViewFormatProperties[];
}

export type IBoardViewQuery2 = Partial<IViewQuery2> & {
	group_by: string;
};

export interface IBoardView extends NotionNode, ParentProps, SpaceShardProps {
	type: 'board';
	name: string;
	format: IBoardViewFormat;
	query2?: IBoardViewQuery2;
}

export interface IGalleryViewFormat {
	inline_collection_first_load_limit: ICollectionLoadLimit;
	gallery_cover?: TViewFormatCover;
	gallery_cover_aspect?: 'contain' | 'cover';
	gallery_cover_size?: 'small' | 'medium' | 'large';
	gallery_properties: ViewFormatProperties[];
}

export type IGalleryViewQuery2 = Partial<Omit<IViewQuery2, 'aggregations'>>;

export interface IGalleryView extends NotionNode, ParentProps, SpaceShardProps {
	type: 'gallery';
	name: string;
	format: IGalleryViewFormat;
	query2?: IGalleryViewQuery2;
}

export interface ICalendarViewFormat {
	calendar_properties: ViewFormatProperties[];
}

export type ICalendarViewQuery2 = Partial<Omit<IViewQuery2, 'aggregations'>> & {
	calendar_by: string;
};

export interface ICalendarView extends NotionNode, ParentProps, SpaceShardProps {
	type: 'calendar';
	name: string;
	format: ICalendarViewFormat;
	query2?: ICalendarViewQuery2;
}

export interface ITimelineViewFormatPreference {
	centerTimestamp: number;
	zoomLevel: TTimelineViewZoomLevel;
}

export interface ITimelineViewFormat {
	timeline_preference: ITimelineViewFormatPreference;
	timeline_properties: ViewFormatProperties[];
	timeline_table_properties: ViewFormatProperties[];
	timeline_show_table: boolean;
	inline_collection_first_load_limit: ICollectionLoadLimit;
}

export type ITimelineViewQuery2 = Partial<IViewQuery2> & {
	timeline_by: string;
};
export interface ITimelineView extends NotionNode, ParentProps, SpaceShardProps {
	type: 'timeline';
	name: string;
	format: ITimelineViewFormat;
	query2: ITimelineViewQuery2;
}

export type TTimelineViewZoomLevel = 'hours' | 'day' | 'week' | 'bi_week' | 'month' | 'quarter' | 'year';

export interface ViewFormatProperties {
	visible: boolean;
	property: string;
}

export interface ViewSorts {
	property: string;
	direction: 'ascending' | 'descending';
}
