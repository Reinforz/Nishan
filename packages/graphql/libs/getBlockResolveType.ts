import { TBlock } from '@nishans/types';

export function getBlockResolveType (obj: TBlock) {
	if (obj.type === 'collection_view') return 'CollectionView';
	else if (obj.type === 'collection_view_page') return 'CollectionViewPage';
	else if (obj.type === 'page') return 'Page';
}
