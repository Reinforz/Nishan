export type TAmount = 'single' | 'multiple';
export type TResult = 'correct' | 'incorrect';
export type TWay = 'id' | 'cb';

type SingleInfo<D> = {
	id: string;
	cb: (data: D) => any;
};

type MultipleInfo<D> = {
	id: [string];
	cb: (data: D) => any;
};

export interface TestInfo<D, C, M extends [string, string]> {
	single: {
		correct: SingleInfo<D>;
		incorrect: SingleInfo<D>;
		method: M[0];
		checker: (data: C, result: TResult) => void;
	};
	multiple: {
		correct: MultipleInfo<D>;
		incorrect: MultipleInfo<D>;
		method: M[1];
		checker: (data: C[], result: TResult) => void;
	};
}
