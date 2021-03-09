import { TTextColor } from '@nishans/types';
import { NotionConstants } from '../libs';

it('NotionConstants.colorTypes', () => {
	const color_types = NotionConstants.colorTypes();
	const color_types_map: Map<TTextColor, true> = new Map();
	color_types.forEach((color_type) => color_types_map.set(color_type, true));

	const expected_color_types: TTextColor[] = [
		'default',
		'gray',
		'brown',
		'orange',
		'yellow',
		'teal',
		'blue',
		'purple',
		'pink',
		'red'
	];

	expect(color_types.length === expected_color_types.length).toBe(true);
	expected_color_types.forEach((expected_color_type) => expect(color_types_map.get(expected_color_type)).toBe(true));
});
