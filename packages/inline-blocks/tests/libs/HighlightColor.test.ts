import { TBGColor, TTextColor } from '@nishans/types';
import { HighlightColor } from '../../libs';

describe('addFormat', () => {
	it(`Should work if format array doesn't exist`, () => {
		const highlight_color = new HighlightColor([ [ 'text' ] ]);
		highlight_color.addFormat([ '_' ]);
		highlight_color.addFormat([ 'b' ]);
		expect(highlight_color.content).toStrictEqual([ [ 'text', [ [ '_' ], [ 'b' ] ] ] ]);
	});

	it(`Should throw error if no text content exists`, () => {
		const highlight_color = new HighlightColor();
		expect(() => highlight_color.addFormat([ '_' ])).toThrow(`No text content to add format to`);
	});
});

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
		expect(highlight_color[color].content).toStrictEqual([ [ color, [ [ 'h', color ] ] ] ]);
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
		expect(highlight_color[color.split('_')[0] + 'bg'].content).toStrictEqual([ [ color, [ [ 'h', color ] ] ] ]);
	});
});
