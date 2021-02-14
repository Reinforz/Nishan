import { NotionCacheObject } from '@nishans/cache';
import { ICollection, TPage } from '@nishans/types';
import { CollectionViewPage, IPageMap, NishanArg, Page } from '../src';

export async function populatePageMap (page: TPage, page_map: IPageMap, props: NishanArg) {
	if (page.type === 'page') {
		const page_obj = new Page(props);
		page_map.page.set(props.id, page_obj);
		page_map.page.set(page.properties.title[0][0], page_obj);
	} else if (page.type === 'collection_view_page') {
		const cvp_obj = new CollectionViewPage(props);
		page_map.collection_view_page.set(props.id, cvp_obj);
		await NotionCacheObject.initializeCacheForSpecificData(props.id, 'block', props, props.cache);
		const collection = props.cache.collection.get(page.collection_id) as ICollection;
		page_map.collection_view_page.set(collection.name[0][0], cvp_obj);
	}
}
