import { ITimelineView } from '@nishans/types';
import { NishanArg } from '../../';
import Aggregator from './Aggregator';

/**
 * A class to represent timeline view of Notion
 * @noInheritDoc
 */

class TimelineView extends Aggregator<ITimelineView> {
	constructor (arg: NishanArg) {
		super({ ...arg });
	}
}

export default TimelineView;
