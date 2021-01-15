import {
	CollectionBlockExtracted,
	CollectionExtracted,
	RowPageExtracted,
	SimplePageProps,
	TViewExtracted
} from '../src/types';
import { ICollection, IPage, TCollectionBlock, TView } from '@nishans/types';

export const extractCollectionBlockData = ({ id, collection_id, view_ids }: TCollectionBlock) =>
	({
		id,
		collection_id,
		view_ids
	} as CollectionBlockExtracted);

export const extractCollectionData = ({ name, icon, cover, id, schema, parent_id }: ICollection) =>
	({
		name: name[0][0],
		icon,
		cover,
		id,
		schema,
		parent_id
	} as CollectionExtracted);

export const extractViewsData = (views_data: TView[]) =>
	views_data.map(({ id, type, name, format, query2, parent_id }) => ({
		id,
		type,
		name,
		format,
		query2,
		parent_id
	})) as TViewExtracted[];

export const extractRowPagesData = (row_pages: IPage[]) => {
	return row_pages.map(({ id, properties, format, parent_id }) => {
		const simple_page_props: SimplePageProps = {} as any;
		Object.entries(properties).map(([ key, value ]) => (simple_page_props[key] = value[0][0]));
		return {
			id,
			properties: simple_page_props,
			format,
			parent_id
		};
	}) as RowPageExtracted[];
};
