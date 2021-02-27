import { getResultTypeFromSchemaType } from '../../../libs/GenerateNotionFormulaAST/utils';

describe('Return result type from schema type', () => {
	it(`Should return correct result_type for checkbox`, () => {
		expect(getResultTypeFromSchemaType('checkbox')).toBe('checkbox');
	});

	[ 'created_time', 'last_edited_time', 'date' ].map((type) => {
		it(`Should return correct result_type for ${type}`, () => {
			expect(getResultTypeFromSchemaType(type as any)).toBe('date');
		});
	});

	[
		'email',
		'file',
		'created_by',
		'last_edited_by',
		'multi_select',
		'select',
		'phone_number',
		'url',
		'title',
		'text'
	].forEach((type) => {
		it(`Should return correct result_type for ${type}`, () => {
			expect(getResultTypeFromSchemaType(type as any)).toBe('text');
		});
	});

	it(`Should return correct result_type for number`, () => {
		expect(getResultTypeFromSchemaType('number')).toBe('number');
	});

	it(`Should throw for unsupported result_type`, () => {
		expect(() => getResultTypeFromSchemaType('boolean' as any)).toThrow(`Unsupported schema type boolean`);
	});
});
