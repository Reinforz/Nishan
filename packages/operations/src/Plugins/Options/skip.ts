import { IOperation } from '@nishans/types';
import { CommonPluginOptions } from '../../types';

/**
 * Skip a certain operation based on the return value of a callback
 * @param skipFn The callback to be invoked to determine whether a operation should be skipped or not 
 * @param operation The operation is question
 */
export function skipOption (operation: IOperation, skipFn?: CommonPluginOptions['skip']) {
	let should_skip = false;
	if (skipFn) should_skip = skipFn(operation);
	if (should_skip) return operation;
}
