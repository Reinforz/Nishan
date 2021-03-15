/**
 * Get child id container from a parent
 * @param child_ids Child path or array of child ids
 * @param parent_data parent data to lookup for child id
 */
export function getChildIds<T> (child_ids: keyof T | string[], parent_data: T) {
	return (Array.isArray(child_ids) ? child_ids : parent_data[child_ids]) as string[];
}
