import { NotionFormula } from '../../libs';
import { cn, ct, sc, sn } from '../utils';

describe('Checking symbol type formula part', () => {
	it('Should output correctly for symbol true', () => {
		expect(sc).toStrictEqual(NotionFormula.GenerateArg.literal(true));
	});

	it('Should output correctly for symbol false', () => {
		expect({
			...sc,
			name: 'false'
		}).toStrictEqual(NotionFormula.GenerateArg.literal(false));
	});

	it('Should output correctly for symbol e', () => {
		expect(sn).toStrictEqual(NotionFormula.GenerateArg.literal('e'));
	});

	it('Should output correctly for symbol pi', () => {
		expect({
			...sn,
			name: 'pi'
		}).toStrictEqual(NotionFormula.GenerateArg.literal('pi'));
	});
});

describe('Checking constant type formula part', () => {
	it('Should output correctly for constant "text"', () => {
		expect(ct).toStrictEqual(NotionFormula.GenerateArg.literal('text'));
	});

	it('Should output correctly for constant 1', () => {
		expect(cn).toStrictEqual(NotionFormula.GenerateArg.literal(1));
	});
});

it('Should throw error when unsupported literal is used', () => {
	expect(() => NotionFormula.GenerateArg.literal({} as any)).toThrow(`${{}} is a malformed value`);
});
