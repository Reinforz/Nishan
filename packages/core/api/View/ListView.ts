import { IListView } from '@nishan/types';
import { NishanArg } from 'types';
import View from './View';

/**
 * A class to represent list view of Notion
 * @noInheritDoc
 */
class ListView extends View<IListView> {
	constructor (arg: NishanArg) {
		super({ ...arg });
	}
}

export default ListView;
