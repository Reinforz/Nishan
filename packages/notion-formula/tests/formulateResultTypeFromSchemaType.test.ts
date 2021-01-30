import { formulateResultTypeFromSchemaType } from '../src';

describe('Return result type from schema type', () => {
	it(`Should return correct result_type for checkbox`, () => {
		expect(formulateResultTypeFromSchemaType('checkbox')).toBe('checkbox');
	});

	it(`Should return correct result_type for date`, () => {
		expect(formulateResultTypeFromSchemaType('date')).toBe('date');
	});

	it(`Should return correct result_type for phone_number`, () => {
		expect(formulateResultTypeFromSchemaType('phone_number')).toBe('text');
	});

	it(`Should return correct result_type for number`, () => {
		expect(formulateResultTypeFromSchemaType('number')).toBe('number');
	});

	it(`Should throw for unsupported result_type`, () => {
		expect(() => formulateResultTypeFromSchemaType('boolean' as any)).toThrow(`Unsupported schema type boolean`);
	});
});
