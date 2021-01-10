import {
	TextSchemaUnit,
	NumberSchemaUnit,
	SelectSchemaUnit,
	MultiSelectSchemaUnit,
	TitleSchemaUnit,
	DateSchemaUnit,
	PersonSchemaUnit,
	FileSchemaUnit,
	CheckboxSchemaUnit,
	UrlSchemaUnit,
	EmailSchemaUnit,
	PhoneNumberSchemaUnit,
	FormulaSchemaUnit,
	RelationSchemaUnit,
	RollupSchemaUnit,
	CreatedTimeSchemaUnit,
	CreatedBySchemaUnit,
	LastEditedTimeSchemaUnit,
	LastEditedBySchemaUnit,
	IEmbed,
	IVideo,
	IAudio,
	IImage,
	IWebBookmark,
	ICode,
	IFile,
	ITweet,
	IGist,
	ICodepen,
	IMaps,
	IFigma,
	IDrive,
	IText,
	ITOC,
	IEquation,
	IBreadcrumb,
	IFactory,
	ITodo,
	IHeader,
	ISubHeader,
	IBulletedList,
	INumberedList,
	IToggle,
	IQuote,
	IDivider,
	ICallout,
	IColumnList,
	IColumn
} from '@nishans/types';
import {
	CollectionViewPage,
	Page,
	SchemaUnit,
	TableView,
	GalleryView,
	ListView,
	BoardView,
	TimelineView,
	CalendarView,
	Block,
	CollectionView
} from '../api';
import {
	IEmbedInput,
	IVideoInput,
	IAudioInput,
	IImageInput,
	IWebBookmarkInput,
	ICodeInput,
	IFileInput,
	ITweetInput,
	IGistInput,
	ICodepenInput,
	IMapsInput,
	IFigmaInput,
	IDriveInput,
	ITextInput,
	ITOCInput,
	IEquationInput,
	IBreadcrumbInput,
	IFactoryInput,
	ITodoInput,
	IHeaderInput,
	ISubHeaderInput,
	IBulletedListInput,
	INumberedListInput,
	IToggleInput,
	IQuoteInput,
	IDividerInput,
	ICalloutInput,
	IColumnListInput
} from './block';

export interface ITPage {
	collection_view_page: CollectionViewPage[];
	page: Page[];
}

export interface ITSchemaUnit {
	text: SchemaUnit<TextSchemaUnit>[];
	number: SchemaUnit<NumberSchemaUnit>[];
	select: SchemaUnit<SelectSchemaUnit>[];
	multi_select: SchemaUnit<MultiSelectSchemaUnit>[];
	title: SchemaUnit<TitleSchemaUnit>[];
	date: SchemaUnit<DateSchemaUnit>[];
	person: SchemaUnit<PersonSchemaUnit>[];
	file: SchemaUnit<FileSchemaUnit>[];
	checkbox: SchemaUnit<CheckboxSchemaUnit>[];
	url: SchemaUnit<UrlSchemaUnit>[];
	email: SchemaUnit<EmailSchemaUnit>[];
	phone_number: SchemaUnit<PhoneNumberSchemaUnit>[];
	formula: SchemaUnit<FormulaSchemaUnit>[];
	relation: SchemaUnit<RelationSchemaUnit>[];
	rollup: SchemaUnit<RollupSchemaUnit>[];
	created_time: SchemaUnit<CreatedTimeSchemaUnit>[];
	created_by: SchemaUnit<CreatedBySchemaUnit>[];
	last_edited_time: SchemaUnit<LastEditedTimeSchemaUnit>[];
	last_edited_by: SchemaUnit<LastEditedBySchemaUnit>[];
}

export interface ITView {
	table: TableView[];
	gallery: GalleryView[];
	list: ListView[];
	board: BoardView[];
	timeline: TimelineView[];
	calendar: CalendarView[];
}

export interface ITBlock {
	link_to_page: Block<any, any>[];
	embed: Block<IEmbed, IEmbedInput>[];
	video: Block<IVideo, IVideoInput>[];
	audio: Block<IAudio, IAudioInput>[];
	image: Block<IImage, IImageInput>[];
	bookmark: Block<IWebBookmark, IWebBookmarkInput>[];
	code: Block<ICode, ICodeInput>[];
	file: Block<IFile, IFileInput>[];
	tweet: Block<ITweet, ITweetInput>[];
	gist: Block<IGist, IGistInput>[];
	codepen: Block<ICodepen, ICodepenInput>[];
	maps: Block<IMaps, IMapsInput>[];
	figma: Block<IFigma, IFigmaInput>[];
	drive: Block<IDrive, IDriveInput>[];
	text: Block<IText, ITextInput>[];
	table_of_contents: Block<ITOC, ITOCInput>[];
	equation: Block<IEquation, IEquationInput>[];
	breadcrumb: Block<IBreadcrumb, IBreadcrumbInput>[];
	factory: {
		block: Block<IFactory, IFactoryInput>;
		contents: ITBlock;
	}[];
	page: Page[];
	to_do: Block<ITodo, ITodoInput>[];
	header: Block<IHeader, IHeaderInput>[];
	sub_header: Block<ISubHeader, ISubHeaderInput>[];
	sub_sub_header: Block<ISubHeader, ISubHeaderInput>[];
	bulleted_list: Block<IBulletedList, IBulletedListInput>[];
	numbered_list: Block<INumberedList, INumberedListInput>[];
	toggle: Block<IToggle, IToggleInput>[];
	quote: Block<IQuote, IQuoteInput>[];
	divider: Block<IDivider, IDividerInput>[];
	callout: Block<ICallout, ICalloutInput>[];
	collection_view: CollectionView[];
	collection_view_page: CollectionViewPage[];
	linked_db: CollectionView[];
	column_list: Block<IColumnList, IColumnListInput>[];
	column: Block<IColumn, any>[];
}
