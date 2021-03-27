import { NotionCache } from '@nishans/cache';
import { ICollection, ICollectionViewPage, IPage } from '@nishans/types';
import { INotionCoreOptions } from '../';

export async function createSpaceIterateData (
	block_id: string,
	props: Pick<INotionCoreOptions, 'cache' | 'token' | 'interval' | 'user_id'>
): Promise<IPage | (ICollectionViewPage & { collection: ICollection }) | undefined> {
	const data = (await NotionCache.fetchDataOrReturnCached('block', block_id, props)) as
		| IPage
		| (ICollectionViewPage & { collection: ICollection });
	if (data.type === 'page') return data;
	else if (data.type === 'collection_view_page') {
		await NotionCache.fetchDataOrReturnCached('collection', data.collection_id, props);
		return {
			...data,
			collection: props.cache.collection.get(data.collection_id) as ICollection
		};
	}
}
