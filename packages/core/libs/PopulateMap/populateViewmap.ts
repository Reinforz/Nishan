import { INotionFabricatorOptions } from '@nishans/fabricator';
import { TView } from '@nishans/types';
import { IViewMap } from '../../types';
import { BoardView, CalendarView, GalleryView, ListView, TableView, TimelineView } from '../api/View';

const view_class = {
	board: BoardView,
	gallery: GalleryView,
	list: ListView,
	timeline: TimelineView,
	table: TableView,
	calendar: CalendarView
};

export const populateViewMap = (view: TView, options: INotionFabricatorOptions, view_map: IViewMap) => {
	const view_obj = new view_class[view.type]({
		id: view.id,
		...options
	}) as any;
	view_map[view.type].set(view.id, view_obj);
	view_map[view.type].set(view.name, view_obj);
};
