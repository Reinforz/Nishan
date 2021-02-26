import { ITableView } from '@nishans/types';
import { NishanArg } from '../../';
import Aggregator from './Aggregator';

/**
 * A class to represent table view of Notion
 * @noInheritDoc
 */
class TableView extends Aggregator<ITableView> {
	constructor (arg: NishanArg) {
		super({ ...arg });
	}
}

export default TableView;
