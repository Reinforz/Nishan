import { UnsupportedBlockTypeError } from '@nishans/errors';
import { TBlockType } from '@nishans/types';
import { NishanArg } from '../types';
/**
 * Create class from passed data
 * @param type The type of data
 * @param id The id of data
 * @param props The props passed to the constructor
 */
export function createBlockClass (type: TBlockType, id: string, props: Omit<NishanArg, 'id'>) {
	// This will be passed to the constructor when creating the classes
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
		case 'column_list':
		case 'column':
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
			// All these data types belongs to the block type
			// dynamically loading the Block class
			const Block = require('../src/Block/Block').default;
			return new Block(obj);
		case 'page':
			const Page = require('../src/Block/Page').default;
			return new Page(obj);
		case 'collection_view':
		case 'linked_db':
			const CollectionView = require('../src/Block/CollectionView').default;
			return new CollectionView(obj);
		case 'collection_view_page':
			const CollectionViewPage = require('../src/Block/CollectionViewPage').default;
			return new CollectionViewPage(obj);
		default:
			// Throws an error if an unsupported data type is passed
			throw new UnsupportedBlockTypeError(type, [
				'page',
				'collection_view',
				'collection_view_page',
				'linked_db',
				'video',
				'audio',
				'image',
				'bookmark',
				'code',
				'file',
				'tweet',
				'gist',
				'codepen',
				'maps',
				'figma',
				'drive',
				'text',
				'table_of_contents',
				'column_list',
				'column',
				'equation',
				'breadcrumb',
				'factory',
				'to_do',
				'header',
				'sub_header',
				'sub_sub_header',
				'bulleted_list',
				'numbered_list',
				'toggle',
				'quote',
				'divider',
				'callout'
			]);
	}
}
