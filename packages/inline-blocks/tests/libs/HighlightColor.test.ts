import { TBGColor, TTextColor } from '@nishans/types';
import { HighlightColor } from '../../libs';

([
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
] as TTextColor[]).forEach((color) => {
	it(`Should work for ${color}`, () => {
		const highlight_color: any = new HighlightColor([ [ color ] ]);
		expect(highlight_color[color].text).toStrictEqual([ [ color, [ [ 'h', color ] ] ] ]);
	});
});

([
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
] as TBGColor[]).forEach((color) => {
	it(`Should work for ${color}`, () => {
		const highlight_color: any = new HighlightColor([ [ color ] ]);
		expect(highlight_color[color.split('_')[0] + 'bg'].text).toStrictEqual([ [ color, [ [ 'h', color ] ] ] ]);
	});
});
