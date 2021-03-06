import { ITableView } from '@nishans/types';
import { INotionCoreOptions } from '../../';
import Aggregator from './Aggregator';

/**
 * A class to represent table view of Notion
 * @noInheritDoc
 */
class TableView extends Aggregator<ITableView> {
	constructor (arg: INotionCoreOptions) {
		super({ ...arg });
	}
}

export default TableView;
