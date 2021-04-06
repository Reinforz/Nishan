import { IListView } from '@nishans/types';
import { INotionCoreOptions } from '../../';
import View from './View';

/**
 * A class to represent list view of Notion
 * @noInheritDoc
 */
class ListView extends View<IListView, Partial<Pick<IListView, 'format' | 'name' | 'query2' | 'type'>>> {
	constructor (arg: INotionCoreOptions) {
		super({ ...arg });
	}
}

export default ListView;
