import { CollectionExtracted, RowPageExtracted, SimplePageProps, TViewExtracted } from '../src/types';
import { ICollection, IPage, TView } from '@nishans/types';

export const extractCollectionData = ({ name, icon, cover, schema }: ICollection) => {
	return {
		name: Array.isArray(name) ? (Array.isArray(name[0]) ? name[0][0] : name[0]) : name,
		icon,
		cover,
		schema
	} as CollectionExtracted;
};

export const extractViewsData = (views_data: TView[]) =>
	views_data.map(({ type, name, format, query2 }) => ({
		type,
		name,
		format,
		query2
	})) as TViewExtracted[];

export const extractPagesData = (row_pages: IPage[]) => {
	return row_pages.map(({ properties, format }) => {
		const simple_page_props: SimplePageProps = {} as any;
		Object.entries(properties).map(
			([ key, value ]) =>
				(simple_page_props[key] = Array.isArray(value) ? (Array.isArray(value[0]) ? value[0][0] : value[0]) : value)
		);
		return {
			properties: simple_page_props,
			format
		};
	}) as RowPageExtracted[];
};
