import { IBoardView } from '@nishans/types';
import { INotionCoreOptions } from '../../';
import Aggregator from './Aggregator';

/**
 * A class to represent board view of Notion
 * @noInheritDoc
 */

class BoardView extends Aggregator<IBoardView> {
	constructor (arg: INotionCoreOptions) {
		super({ ...arg });
	}
}

export default BoardView;
