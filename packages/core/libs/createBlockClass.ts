import { NotionConstants } from '@nishans/constants';
import { NotionErrors } from '@nishans/errors';
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

	if (type === 'page') {
		const Page = require('./api/Block/Page').default;
		return new Page(obj);
	} else if (type === 'collection_view' || type === 'linked_db') {
		const CollectionView = require('./api/Block/CollectionView').default;
		return new CollectionView(obj);
	} else if (type === 'collection_view_page') {
		const CollectionViewPage = require('./api/Block/CollectionViewPage').default;
		return new CollectionViewPage(obj);
	} else if (NotionConstants.blockTypes().includes(type)) {
		const Block = require('./api/Block/Block').default;
		return new Block(obj);
	} else throw new NotionErrors.unsupported_block_type(type, NotionConstants.blockTypes());
}
