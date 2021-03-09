import { TBGColor } from '@nishans/types';
import { NotionConstants } from '../libs';

it('NotionConstants.bgColorTypes', () => {
	const bg_color_types = NotionConstants.bgColorTypes();
	const bg_color_types_map: Map<TBGColor, true> = new Map();
	bg_color_types.forEach((bg_color_type) => bg_color_types_map.set(bg_color_type, true));

	const expected_bg_color_types: TBGColor[] = [
		'default_background',
		'gray_background',
		'brown_background',
		'orange_background',
		'yellow_background',
		'teal_background',
		'blue_background',
		'purple_background',
		'pink_background',
		'red_background'
	];

	expect(bg_color_types.length === expected_bg_color_types.length).toBe(true);
	expected_bg_color_types.forEach((expected_bg_color_type) =>
		expect(bg_color_types_map.get(expected_bg_color_type)).toBe(true)
	);
});
