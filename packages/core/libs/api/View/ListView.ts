import { IListView } from '@nishans/types';
import { INotionCoreOptions } from '../../';
import View from './View';

/**
 * A class to represent list view of Notion
 * @noInheritDoc
 */
class ListView extends View<IListView> {
	constructor (arg: INotionCoreOptions) {
		super({ ...arg });
	}
}

export default ListView;
