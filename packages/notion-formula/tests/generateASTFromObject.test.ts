import { ISchemaMap, parseFormulaFromObject } from '../src';
import deepEqual from 'deep-equal';
import { generateNumberConstant, generateNumberFunction, generateNumberProperty } from './utils/generateFormulaParts';

describe('Single number argument formulas with number return type should work correctly for object ast', () => {
  // Single number argument number return_type formulas
  const narg1_nrt_formula_names = [
		'unaryMinus',
		'unaryPlus',
		'abs',
		'cbrt',
		'ceil',
		'exp',
		'floor',
		'ln',
		'log10',
		'log2',
		'max',
		'min',
		'round',
		'sign',
    'sqrt',
  ] as const;
  
  const schema_map: ISchemaMap = new Map([['number', {schema_id: 'number', type: "number", name: "number"}]])

	narg1_nrt_formula_names.forEach((narg1_nrt_formula_name) => {
		it(`Should work for ${narg1_nrt_formula_name} function when argument is number constant`, () => {
			expect(
				deepEqual(
					generateNumberFunction(narg1_nrt_formula_name, [
            generateNumberConstant(1)
          ]),
          parseFormulaFromObject(
            {
              function: narg1_nrt_formula_name,
              args: [1]
            },
            schema_map
          )
				)
			).toBe(true);
		});
  });
  
  narg1_nrt_formula_names.forEach((narg1_nrt_formula_name) => {
		it(`Should work for ${narg1_nrt_formula_name} function when argument is number function`, () => {
			expect(
				deepEqual(
					generateNumberFunction(narg1_nrt_formula_name, [
            generateNumberFunction('abs', [generateNumberConstant(1)])
          ]),
					parseFormulaFromObject(
            {
              function: narg1_nrt_formula_name,
              args:[{
                function: 'abs',
                args: [1]
              } ]
            },
            schema_map
          )
				)
			).toBe(true);
		});
  });
  
  narg1_nrt_formula_names.forEach((narg1_nrt_formula_name) => {
		it(`Should work for ${narg1_nrt_formula_name} function when argument is number property`, () => {
			expect(
				deepEqual(
					generateNumberFunction(narg1_nrt_formula_name, [ generateNumberProperty('number')]),
					parseFormulaFromObject(
            {
              function: narg1_nrt_formula_name,
              args:[{
                property: "number"
              } ]
            },
            schema_map
          )
				)
			).toBe(true);
		});
  });
});