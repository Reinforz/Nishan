import { TFunctionName } from '@nishans/types';
import deepEqual from 'deep-equal';

import { generateFormulaASTFromObject, generateFormulaASTFromArray } from '../src';
import { function_formula_info_arr } from '../utils';
import { test_schema_map, generateFunction, generateFunctionFormulaArguments } from './utils';

function_formula_info_arr.forEach(({ function_name, signatures }) => {
	it(`Should throw for using unsupported function ${function_name + '_unknown'}`, () => {
		expect(() => generateFormulaASTFromArray([ function_name + '_unknown' ] as any, test_schema_map)).toThrow();
		expect(() =>
			generateFormulaASTFromObject({ function: function_name + '_unknown' } as any, test_schema_map)
		).toThrow(`Function ${function_name}_unknown is not supported`);
	});

  const all_supported_arity_length = Array.from(new Set(signatures.map(signature=>signature?.arity?.length)));
  
	signatures.forEach((signature) => {
		if (signature.arity) {
			const generated_arguments = generateFunctionFormulaArguments(signature.arity);
      
			generated_arguments.forEach((generated_argument) => {
				const formula_ast = generateFunction(
					function_name as TFunctionName,
					signature.result_type,
					generated_argument.ast
				);

				const formula_obj = generateFormulaASTFromObject(
					{
						function: function_name,
						args: generated_argument.object
					} as any,
					test_schema_map
				);

				const formula_arr = generateFormulaASTFromArray(
					[ function_name, generated_argument.array ] as any,
					test_schema_map
				);
        
        it(`Should throw argument length error for array ${function_name}`, ()=>{
          expect(()=>{
            generateFormulaASTFromArray(
              [ function_name, generated_argument.array.concat(['test', true, 'e']) ] as any,
              test_schema_map
            )
          }).toThrow()
        })

        it(`Should throw argument length error for object ${function_name}`, ()=>{
          expect(()=>{
            generateFormulaASTFromObject(
              [ function_name, generated_argument.object.concat(['test', true, 'e']) ] as any,
              test_schema_map
            )
          }).toThrow()
        })

				it(`Should match for obj ${function_name} [${generated_argument.message}]`, () => {
					expect(deepEqual(formula_ast, formula_obj)).toBe(true);
				});

				it(`Should match for arr ${function_name} [${generated_argument.message}]`, () => {
					expect(deepEqual(formula_ast, formula_arr)).toBe(true);
				});
			});
		}
	});
});
