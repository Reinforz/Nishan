import { ICollection, TCollectionBlock, TView } from '@nishans/types';

export interface LocalFileStructure {
	block: TCollectionBlock;
	views: TView[];
	collection: ICollection;
}
