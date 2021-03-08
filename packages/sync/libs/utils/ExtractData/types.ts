import { ICollection, IPage, TView } from '@nishans/types';
import { CollectionExtracted, PageExtracted, TViewExtracted } from '../..';

export interface DataShape {
	collection: ICollection | CollectionExtracted;
	views: TView[] | TViewExtracted[];
	row_pages: IPage[] | PageExtracted[];
	template_pages: IPage[] | PageExtracted[];
}
