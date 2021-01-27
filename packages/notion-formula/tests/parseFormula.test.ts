import { parseFormula } from '../src';
import deepEqual from 'deep-equal';

it('Abs method should work correctly', () => {
	expect(
		deepEqual(
			{
				type: 'function',
				result_type: 'number',
				name: 'abs',
				args: [
					{
						type: 'constant',
						result_type: 'number',
						value: '1',
						value_type: 'number'
					}
				]
			},
			parseFormula(
				{
					function: 'abs',
					args: 1
				},
				new Map()
			)
		)
	).toBe(true);
});
