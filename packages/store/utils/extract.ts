import { CollectionExtracted, RowPageExtracted, SimplePageProps, TViewExtracted } from '../src/types';
import { ICollection, IPage, TCollectionBlock, TView } from '@nishans/types';

export const extractCollectionData = ({ name, icon, cover, id, schema, parent_id }: ICollection) => {
	return {
		name: Array.isArray(name) ? (Array.isArray(name[0]) ? name[0][0] : name[0]) : name,
		icon,
		cover,
		id,
		schema,
		parent_id
	} as CollectionExtracted;
};

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
		Object.entries(properties).map(
			([ key, value ]) =>
				(simple_page_props[key] = Array.isArray(value) ? (Array.isArray(value[0]) ? value[0][0] : value[0]) : value)
		);
		return {
			id,
			properties: simple_page_props,
			format,
			parent_id
		};
	}) as RowPageExtracted[];
};
