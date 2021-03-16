import { CollectionExtracted, PageExtracted, TViewExtracted } from '@nishans/extract';
import { ICollection, IPage, TView } from '@nishans/types';
export interface LocalFileStructure {
	views: TViewExtracted[];
	collection: CollectionExtracted;
	row_pages: PageExtracted[];
	template_pages: PageExtracted[];
}

export interface DataShape {
	collection: ICollection | CollectionExtracted;
	views: TView[] | TViewExtracted[];
	row_pages: IPage[] | PageExtracted[];
	template_pages: IPage[] | PageExtracted[];
}
