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

export interface ITestData<D extends TData = TData, T extends TDataType = TDataType> {
	data: D;
	id: {
		correct: string;
		incorrect: string;
	};
	type: T;
}

export interface BlockMap {
	link_to_page: ITestData<ILinkToPage, 'block'>[];
	embed: ITestData<IEmbed, 'block'>[];
	video: ITestData<IVideo, 'block'>[];
	audio: ITestData<IAudio, 'block'>[];
	image: ITestData<IImage, 'block'>[];
	bookmark: ITestData<IWebBookmark, 'block'>[];
	code: ITestData<ICode, 'block'>[];
	file: ITestData<IFile, 'block'>[];
	tweet: ITestData<ITweet, 'block'>[];
	gist: ITestData<IGist, 'block'>[];
	codepen: ITestData<ICodepen, 'block'>[];
	maps: ITestData<IMaps, 'block'>[];
	figma: ITestData<IFigma, 'block'>[];
	drive: ITestData<IDrive, 'block'>[];
	text: ITestData<IText, 'block'>[];
	table_of_contents: ITestData<ITOC, 'block'>[];
	equation: ITestData<IEquation, 'block'>[];
	breadcrumb: ITestData<IBreadcrumb, 'block'>[];
	factory: ITestData<IFactory, 'block'>[];
	page: ITestData<IPage, 'block'>[];
	to_do: ITestData<ITodo, 'block'>[];
	header: ITestData<IHeader, 'block'>[];
	sub_header: ITestData<ISubHeader, 'block'>[];
	sub_sub_header: ITestData<ISubSubHeader, 'block'>[];
	bulleted_list: ITestData<IBulletedList, 'block'>[];
	numbered_list: ITestData<INumberedList, 'block'>[];
	toggle: ITestData<IToggle, 'block'>[];
	quote: ITestData<IQuote, 'block'>[];
	divider: ITestData<IDivider, 'block'>[];
	callout: ITestData<ICallout, 'block'>[];
	collection_view: ITestData<ICollectionView, 'block'>[];
	collection_view_page: ITestData<ICollectionViewPage, 'block'>[];
	linked_db: ITestData<ICollectionView, 'block'>[];
	column_list: ITestData<IColumnList, 'block'>[];
	column: ITestData<IColumn, 'block'>[];
}

export type TestData = {
	block: BlockMap;
	collection: ITestData<ICollection, 'collection'>[];
	collection_view: ITestData<TView, 'collection_view'>[];
	space: ITestData<ISpace, 'space'>[];
	notion_user: ITestData<INotionUser, 'notion_user'>[];
	space_view: ITestData<ISpaceView, 'space_view'>[];
	user_root: ITestData<IUserRoot, 'user_root'>[];
	user_settings: ITestData<IUserSettings, 'user_settings'>[];
};
