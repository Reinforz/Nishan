import { PopulateViewData } from '../../';

describe('view_type=table', () => {
	it(`Should work with number input`, () => {
		expect(PopulateViewData.format_properties('table', 'text', 150)).toStrictEqual({
			property: 'text',
			visible: true,
			width: 150
		});
	});

	it(`Should work with boolean input`, () => {
		expect(PopulateViewData.format_properties('table', 'text', false)).toStrictEqual({
			property: 'text',
			visible: false,
			width: 250
		});
	});

	it(`Should work with [boolean, number] input`, () => {
		expect(PopulateViewData.format_properties('table', 'text', [ false, 120 ])).toStrictEqual({
			property: 'text',
			visible: false,
			width: 120
		});
	});

	it(`Should work with [] input`, () => {
		expect(PopulateViewData.format_properties('table', 'text', [] as any)).toStrictEqual({
			property: 'text',
			visible: true,
			width: 250
		});
	});

	it(`Should work with no input`, () => {
		expect(PopulateViewData.format_properties('table', 'text')).toStrictEqual({
			property: 'text',
			visible: true,
			width: 250
		});
	});
});

describe('view_type!=table', () => {
	it(`Should work with number input`, () => {
		expect(PopulateViewData.format_properties('list', 'text', false)).toStrictEqual({
			property: 'text',
			visible: false
		});
	});
});
