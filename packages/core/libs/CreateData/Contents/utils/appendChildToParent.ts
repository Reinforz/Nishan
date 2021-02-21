import { ICache, NotionCacheObject } from '@nishans/cache';
import { Operation } from '@nishans/operations';
import { ICollection, IOperation, IPage, ISpace } from '@nishans/types';

export async function appendChildToParent (
	parent_table: 'space' | 'block' | 'collection',
	parent_id: string,
	content_id: string,
	cache: ICache,
	stack: IOperation[],
	token: string
): Promise<void> {
	switch (parent_table) {
		case 'block': {
			stack.push(Operation.block.listAfter(parent_id, [ 'content' ], { after: '', id: content_id }));
			const parent = await NotionCacheObject.fetchDataOrReturnCached<IPage>(
				parent_table,
				parent_id,
				{ token, interval: 0 },
				cache
			);
			if (!parent['content']) parent['content'] = [];
			parent['content'].push(content_id);
			break;
		}
		case 'space': {
			stack.push(Operation.space.listAfter(parent_id, [ 'pages' ], { after: '', id: content_id }));
			const parent = await NotionCacheObject.fetchDataOrReturnCached<ISpace>(
				parent_table,
				parent_id,
				{ token, interval: 0 },
				cache
			);
			if (!parent['pages']) parent['pages'] = [];
			parent['pages'].push(content_id);
			break;
		}
		case 'collection': {
			stack.push(Operation.collection.listAfter(parent_id, [ 'template_pages' ], { after: '', id: content_id }));
			const parent = await NotionCacheObject.fetchDataOrReturnCached<ICollection>(
				parent_table,
				parent_id,
				{ token, interval: 0 },
				cache
			);
			if (!parent['template_pages']) parent['template_pages'] = [];
			parent['template_pages'].push(content_id);
			break;
		}
	}
}
