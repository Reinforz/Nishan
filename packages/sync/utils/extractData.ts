import { CollectionExtracted, LocalFileStructure, PageExtracted, TViewExtracted } from '../src/types';
import { ICollection, IPage, TView } from '@nishans/types';

export const extractCollectionData = ({
	description,
	name,
	icon,
	cover,
	schema
}: ICollection | CollectionExtracted) => {
	return {
		name,
		icon,
		cover,
		description,
		schema
	} as CollectionExtracted;
};

export const extractViewsData = (views_data: TView[] | TViewExtracted[]) => {
	return (views_data as any).map((view_data: any) => {
		return {
			type: view_data.type,
			name: view_data.name,
			format: view_data.format,
			query2: view_data.query2
		};
	});
};

export const extractPagesData = (row_pages: IPage[] | PageExtracted[]) => {
	return (row_pages as any).map(({ properties, format }: any) => {
		return {
			properties,
			format
		};
	});
};

interface DataShape {
	collection: ICollection | CollectionExtracted;
	views: TView[] | TViewExtracted[];
	row_pages: IPage[] | PageExtracted[];
	template_pages: IPage[] | PageExtracted[];
}

export const extractData = (data: DataShape) => {
	return {
		collection: extractCollectionData(data.collection),
		views: extractViewsData(data.views),
		row_pages: extractPagesData(data.row_pages),
		template_pages: extractPagesData(data.template_pages)
	} as LocalFileStructure;
};
