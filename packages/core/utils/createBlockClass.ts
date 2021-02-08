import { TBlockType } from '@nishans/types';
import { NishanArg } from '../types';

export function createBlockClass (type: TBlockType, id: string, props: Omit<NishanArg, 'id'>) {
	const Page = require('../src/Page').default;
	const Block = require('../src/Block').default;
	const CollectionView = require('../src/CollectionView').default;
	const CollectionViewPage = require('../src/CollectionViewPage').default;

	const obj = {
		id,
		...props
	};

	switch (type) {
		case 'video':
		case 'audio':
		case 'image':
		case 'bookmark':
		case 'code':
		case 'file':
		case 'tweet':
		case 'gist':
		case 'codepen':
		case 'maps':
		case 'figma':
		case 'drive':
		case 'text':
		case 'table_of_contents':
		case 'equation':
		case 'breadcrumb':
		case 'factory':
		case 'to_do':
		case 'header':
		case 'sub_header':
		case 'sub_sub_header':
		case 'bulleted_list':
		case 'numbered_list':
		case 'toggle':
		case 'quote':
		case 'divider':
		case 'callout':
			return new Block(obj);
		case 'page':
			return new Page(obj);
		case 'collection_view':
			return new CollectionView(obj);
		case 'collection_view_page':
			return new CollectionViewPage(obj);
		default:
			throw new Error(`Unsupported block type ${type} passed`);
	}
}
