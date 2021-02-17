import { formulateResultTypeFromSchemaType } from '../../src';

describe('Return result type from schema type', () => {
	it(`Should return correct result_type for checkbox`, () => {
		expect(formulateResultTypeFromSchemaType('checkbox')).toBe('checkbox');
	});

	it(`Should return correct result_type for created_time`, () => {
		expect(formulateResultTypeFromSchemaType('created_time')).toBe('date');
	});

	it(`Should return correct result_type for last_edited_time`, () => {
		expect(formulateResultTypeFromSchemaType('last_edited_time')).toBe('date');
	});

	it(`Should return correct result_type for date`, () => {
		expect(formulateResultTypeFromSchemaType('date')).toBe('date');
	});

	it(`Should return correct result_type for email`, () => {
		expect(formulateResultTypeFromSchemaType('email')).toBe('text');
	});

	it(`Should return correct result_type for file`, () => {
		expect(formulateResultTypeFromSchemaType('file')).toBe('text');
	});

	it(`Should return correct result_type for created_by`, () => {
		expect(formulateResultTypeFromSchemaType('created_by')).toBe('text');
	});

	it(`Should return correct result_type for last_edited_by`, () => {
		expect(formulateResultTypeFromSchemaType('last_edited_by')).toBe('text');
	});

	it(`Should return correct result_type for multi_select`, () => {
		expect(formulateResultTypeFromSchemaType('multi_select')).toBe('text');
	});

	it(`Should return correct result_type for select`, () => {
		expect(formulateResultTypeFromSchemaType('select')).toBe('text');
	});

	it(`Should return correct result_type for phone_number`, () => {
		expect(formulateResultTypeFromSchemaType('phone_number')).toBe('text');
	});

	it(`Should return correct result_type for url`, () => {
		expect(formulateResultTypeFromSchemaType('url')).toBe('text');
	});

	it(`Should return correct result_type for title`, () => {
		expect(formulateResultTypeFromSchemaType('title')).toBe('text');
	});

	it(`Should return correct result_type for text`, () => {
		expect(formulateResultTypeFromSchemaType('text')).toBe('text');
	});

	it(`Should return correct result_type for number`, () => {
		expect(formulateResultTypeFromSchemaType('number')).toBe('number');
	});

	it(`Should throw for unsupported result_type`, () => {
		expect(() => formulateResultTypeFromSchemaType('boolean' as any)).toThrow(`Unsupported schema type boolean`);
	});
});
