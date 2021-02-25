import { GenerateNotionFormulaArg } from '../../../src';
import { cn, ct, sc, sn } from '../utils';

describe('Checking symbol type formula part', () => {
	it('Should output correctly for symbol true', () => {
		expect(sc).toStrictEqual(GenerateNotionFormulaArg.literal(true));
	});

	it('Should output correctly for symbol false', () => {
		expect({
			...sc,
			name: 'false'
		}).toStrictEqual(GenerateNotionFormulaArg.literal(false));
	});

	it('Should output correctly for symbol e', () => {
		expect(sn).toStrictEqual(GenerateNotionFormulaArg.literal('e'));
	});

	it('Should output correctly for symbol pi', () => {
		expect({
			...sn,
			name: 'pi'
		}).toStrictEqual(GenerateNotionFormulaArg.literal('pi'));
	});
});

describe('Checking constant type formula part', () => {
	it('Should output correctly for constant "text"', () => {
		expect(ct).toStrictEqual(GenerateNotionFormulaArg.literal('text'));
	});

	it('Should output correctly for constant 1', () => {
		expect(cn).toStrictEqual(GenerateNotionFormulaArg.literal(1));
	});
});

it('Should throw error when unsupported literal is used', () => {
	expect(() => GenerateNotionFormulaArg.literal({} as any)).toThrow(`${{}} is a malformed value`);
});
