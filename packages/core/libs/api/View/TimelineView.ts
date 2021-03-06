import { ITimelineView } from '@nishans/types';
import { INotionCoreOptions } from '../../';
import Aggregator from './Aggregator';

/**
 * A class to represent timeline view of Notion
 * @noInheritDoc
 */

class TimelineView extends Aggregator<ITimelineView> {
	constructor (arg: INotionCoreOptions) {
		super({ ...arg });
	}
}

export default TimelineView;
