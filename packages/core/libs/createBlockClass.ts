import { NotionConstants } from '@nishans/constants';
import { NotionErrors } from '@nishans/errors';
import { INotionFabricatorOptions } from '@nishans/fabricator';
import { TBlockType } from '@nishans/types';
/**
 * Create class from passed data
 * @param type The type of data
 * @param id The id of data
 * @param options The options passed to the constructor
 */
export function createBlockClass (type: TBlockType, id: string, options: INotionFabricatorOptions) {
	// This will be passed to the constructor when creating the classes
	const obj = {
		id,
		...options
	};

	if (type === 'page') {
		const Page = require('./Api/Block/Page').default;
		return new Page(obj);
	} else if (type === 'collection_view' || type === 'linked_db') {
		const CollectionView = require('./Api/Block/CollectionView').default;
		return new CollectionView(obj);
	} else if (type === 'collection_view_page') {
		const CollectionViewPage = require('./Api/Block/CollectionViewPage').default;
		return new CollectionViewPage(obj);
	} else if (NotionConstants.blockTypes().includes(type)) {
		const Block = require('./Api/Block/Block').default;
		return new Block(obj);
	} else throw new NotionErrors.unsupported_block_type(type, NotionConstants.blockTypes());
}
