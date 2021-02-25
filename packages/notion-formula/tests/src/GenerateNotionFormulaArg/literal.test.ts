import { GenerateNotionFormulaArg } from '../../../src';

describe('Checking symbol type formula part', () => {
	it('Should output correctly for symbol true', () => {
		expect({
			type: 'symbol',
			name: 'true',
			result_type: 'checkbox'
		}).toStrictEqual(GenerateNotionFormulaArg.literal(true));
	});

	it('Should output correctly for symbol false', () => {
		expect({
			type: 'symbol',
			name: 'false',
			result_type: 'checkbox'
		}).toStrictEqual(GenerateNotionFormulaArg.literal(false));
	});

	it('Should output correctly for symbol e', () => {
		expect({
			type: 'symbol',
			name: 'e',
			result_type: 'number'
		}).toStrictEqual(GenerateNotionFormulaArg.literal('e'));
	});

	it('Should output correctly for symbol pi', () => {
		expect({
			type: 'symbol',
			name: 'pi',
			result_type: 'number'
		}).toStrictEqual(GenerateNotionFormulaArg.literal('pi'));
	});
});

describe('Checking constant type formula part', () => {
	it('Should output correctly for constant "1"', () => {
		expect({
			type: 'constant',
			value: '1',
			value_type: 'string',
			result_type: 'text'
		}).toStrictEqual(GenerateNotionFormulaArg.literal('1'));
	});

	it('Should output correctly for constant 1', () => {
		expect({
			type: 'constant',
			value: '1',
			value_type: 'number',
			result_type: 'number'
		}).toStrictEqual(GenerateNotionFormulaArg.literal(1));
	});
});

it('Should throw error when unsupported literal is used', () => {
	expect(() => GenerateNotionFormulaArg.literal({} as any)).toThrow(`${{}} is a malformed value`);
});
