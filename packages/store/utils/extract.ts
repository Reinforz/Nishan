import { CollectionBlockExtracted, CollectionExtracted, RowPageExtracted, TViewExtracted } from '../src/types';
import { ICollection, IPage, TCollectionBlock, TView } from '@nishans/types';

export const extractCollectionBlockData = ({ id, collection_id, view_ids }: TCollectionBlock) =>
	({
		id,
		collection_id,
		view_ids
	} as CollectionBlockExtracted);

export const extractCollectionData = ({ name, icon, cover, id, schema, parent_id }: ICollection) =>
	({
		name,
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

export const extractRowPagesData = (row_pages: IPage[]) =>
	row_pages.map(({ id, properties, format, parent_id }) => ({
		id,
		properties,
		format,
		parent_id
	})) as RowPageExtracted[];
