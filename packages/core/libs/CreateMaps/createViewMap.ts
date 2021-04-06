import { NotionConstants } from '@nishans/constants';
import { IViewMap } from '../../types';

/**
 * Returns an object with keys representing all the view types, and values containing a map of objects representing those view types
 */
export const createViewMap = () => {
	const obj: IViewMap = {} as any;
	NotionConstants.viewTypes().map((view_type) => (obj[view_type] = new Map()));
	return obj;
};
