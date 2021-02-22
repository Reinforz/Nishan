import { populateViewProperties } from '../../../../../libs/CreateData/Views/utils';

describe('populateViewProperties', () => {
	it(`Should work with number input`, () => {
		expect(populateViewProperties('text', 150)).toStrictEqual({
			property: 'text',
			visible: true,
			width: 150
		});
	});

	it(`Should work with boolean input`, () => {
		expect(populateViewProperties('text', false)).toStrictEqual({
			property: 'text',
			visible: false,
			width: 250
		});
	});

	it(`Should work with [boolean] input`, () => {
		expect(populateViewProperties('text', [ false ] as any)).toStrictEqual({
			property: 'text',
			visible: false,
			width: 250
		});
	});

	it(`Should work with [boolean, number] input`, () => {
		expect(populateViewProperties('text', [ false, 120 ])).toStrictEqual({
			property: 'text',
			visible: false,
			width: 120
		});
	});

	it(`Should work with [] input`, () => {
		expect(populateViewProperties('text', [] as any)).toStrictEqual({
			property: 'text',
			visible: true,
			width: 250
		});
	});

	it(`Should work with no input`, () => {
		expect(populateViewProperties('text')).toStrictEqual({
			property: 'text',
			visible: true,
			width: 250
		});
	});
});
