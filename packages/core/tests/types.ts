import {
	BlockData,
	IAudio,
	IBreadcrumb,
	IBulletedList,
	ICallout,
	ICode,
	ICodepen,
	ICollection,
	ICollectionView,
	ICollectionViewPage,
	IColumn,
	IColumnList,
	IDivider,
	IDrive,
	IEmbed,
	IEquation,
	IFactory,
	IFigma,
	IFile,
	IGist,
	IHeader,
	IImage,
	ILinkToPage,
	IMaps,
	INotionUser,
	INumberedList,
	IPage,
	IQuote,
	ISpace,
	ISpaceView,
	ISubHeader,
	ISubSubHeader,
	IText,
	ITOC,
	ITodo,
	IToggle,
	ITweet,
	IUserRoot,
	IUserSettings,
	IVideo,
	IWebBookmark,
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

export interface BlockMap {
	link_to_page: Map<string, ITestData<ILinkToPage, 'block'>[]>;
	embed: Map<string, ITestData<IEmbed, 'block'>[]>;
	video: Map<string, ITestData<IVideo, 'block'>[]>;
	audio: Map<string, ITestData<IAudio, 'block'>[]>;
	image: Map<string, ITestData<IImage, 'block'>[]>;
	bookmark: Map<string, ITestData<IWebBookmark, 'block'>[]>;
	code: Map<string, ITestData<ICode, 'block'>[]>;
	file: Map<string, ITestData<IFile, 'block'>[]>;
	tweet: Map<string, ITestData<ITweet, 'block'>[]>;
	gist: Map<string, ITestData<IGist, 'block'>[]>;
	codepen: Map<string, ITestData<ICodepen, 'block'>[]>;
	maps: Map<string, ITestData<IMaps, 'block'>[]>;
	figma: Map<string, ITestData<IFigma, 'block'>[]>;
	drive: Map<string, ITestData<IDrive, 'block'>[]>;
	text: Map<string, ITestData<IText, 'block'>[]>;
	table_of_contents: Map<string, ITestData<ITOC, 'block'>[]>;
	equation: Map<string, ITestData<IEquation, 'block'>[]>;
	breadcrumb: Map<string, ITestData<IBreadcrumb, 'block'>[]>;
	factory: Map<string, ITestData<IFactory, 'block'>[]>;
	page: Map<string, ITestData<IPage, 'block'>[]>;
	to_do: Map<string, ITestData<ITodo, 'block'>[]>;
	header: Map<string, ITestData<IHeader, 'block'>[]>;
	sub_header: Map<string, ITestData<ISubHeader, 'block'>[]>;
	sub_sub_header: Map<string, ITestData<ISubSubHeader, 'block'>[]>;
	bulleted_list: Map<string, ITestData<IBulletedList, 'block'>[]>;
	numbered_list: Map<string, ITestData<INumberedList, 'block'>[]>;
	toggle: Map<string, ITestData<IToggle, 'block'>[]>;
	quote: Map<string, ITestData<IQuote, 'block'>[]>;
	divider: Map<string, ITestData<IDivider, 'block'>[]>;
	callout: Map<string, ITestData<ICallout, 'block'>[]>;
	collection_view: Map<string, ITestData<ICollectionView, 'block'>[]>;
	collection_view_page: Map<string, ITestData<ICollectionViewPage, 'block'>[]>;
	linked_db: Map<string, ITestData<ICollectionView, 'block'>[]>;
	column_list: Map<string, ITestData<IColumnList, 'block'>[]>;
	column: Map<string, ITestData<IColumn, 'block'>[]>;
}

export type TestData = {
	block: ITestData<TBlock, 'block'>[];
	collection: ITestData<ICollection, 'collection'>[];
	collection_view: ITestData<TView, 'collection_view'>[];
	space: ITestData<ISpace, 'space'>[];
	notion_user: ITestData<INotionUser, 'notion_user'>[];
	space_view: ITestData<ISpaceView, 'space_view'>[];
	user_root: ITestData<IUserRoot, 'user_root'>[];
	user_settings: ITestData<IUserSettings, 'user_settings'>[];
};
