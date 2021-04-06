import { NotionCache } from '@nishans/cache';
import { NotionLineage } from '../libs';

it(`NotionLineage.getPageIds`, () => {
	expect(
		NotionLineage.getPageIds({
			...NotionCache.createDefaultCache(),
			block: new Map([
				[ 'block_1', { type: 'collection_view_page' } as any ],
				[ 'block_2', { type: 'page' } as any ],
				[ 'block_3', { type: 'header' } as any ]
			])
		})
	);
});
