import { TAmount, TResult, TWay } from '../types';
import { amount_arr, result_arr, way_arr } from '../utils/testinfos';

export function cycleThroughInfoarr (cb: (amount: TAmount, result: TResult, way: TWay) => void) {
	amount_arr.map((amount) => {
		result_arr.map((result) => {
			way_arr.map((way) => {
				cb(amount, result, way);
			});
		});
	});
}
