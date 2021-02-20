import { IViewMap } from '../../types';

/**
 * Returns an object with keys representing all the view types, and values containing a map of objects representing those view types
 */
export const view = () => {
	return {
		board: new Map(),
		gallery: new Map(),
		list: new Map(),
		timeline: new Map(),
		table: new Map(),
		calendar: new Map()
	} as IViewMap;
};
