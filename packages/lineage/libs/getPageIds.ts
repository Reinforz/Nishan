import { INotionCache, TBlock } from '@nishans/types';

export const getPageIds = (cache: INotionCache) => {
	return Array.from(cache.block.keys()).filter((id) =>
		(cache.block.get(id) as TBlock).type.match(/^(page|collection_view_page)$/)
	);
};
