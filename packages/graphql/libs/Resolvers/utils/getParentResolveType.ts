import { ICollectionViewPage, IPage, ISpace, TParentType } from '@nishans/types';

export function getParentResolveType (obj: TParentType) {
	if ((obj as IPage).type === 'page') return 'Page';
	else if ((obj as ICollectionViewPage).type === 'collection_view_page') return 'CollectionViewPage';
	else if ((obj as ISpace).pages) return 'Space';
}
