import { ICollectionViewPageInput } from '@nishans/fabricator';
import { NotionPermissions } from '@nishans/permissions';
import { ICollectionViewPage } from '@nishans/types';
import { INotionCoreOptions } from '../../';
import { applyMixins } from '../../utils';
import NotionData from '../Data';
import CollectionBlock from './CollectionBlock';
import PageBlock from './PageBlock';

/**
 * A class to represent collection view page of Notion
 * @noInheritDoc
 */
interface CollectionViewPage
	extends CollectionBlock<ICollectionViewPage, ICollectionViewPageInput>,
		PageBlock<ICollectionViewPage, ICollectionViewPageInput> {}

class CollectionViewPage extends NotionData<ICollectionViewPage, ICollectionViewPageInput> {
	Permissions: InstanceType<typeof NotionPermissions.Block>;
	constructor (arg: INotionCoreOptions) {
		super({ ...arg, type: 'block' });
		this.Permissions = new NotionPermissions.Block(arg);
	}
}

applyMixins(CollectionViewPage, [ CollectionBlock, PageBlock ]);
export default CollectionViewPage;
