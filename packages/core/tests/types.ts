import {
	BlockData,
	ICollection,
	INotionUser,
	ISpace,
	ISpaceView,
	IUserRoot,
	IUserSettings,
	TBlock,
	TData,
	TDataType,
	TView
} from '@nishans/types';

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

export interface ITestData<D extends TData, T extends TDataType> {
	data: D;
	id: {
		correct: string;
		incorrect: string;
	};
	type: T;
}

type TestData = {
	block: ITestData<TBlock, 'block'>[];
	collection: ITestData<ICollection, 'collection'>[];
	collection_view: ITestData<TView, 'collection_view'>[];
	space: ITestData<ISpace, 'space'>[];
	notion_user: ITestData<INotionUser, 'notion_user'>[];
	space_view: ITestData<ISpaceView, 'space_view'>[];
	user_root: ITestData<IUserRoot, 'user_root'>[];
	user_settings: ITestData<IUserSettings, 'user_settings'>[];
};
