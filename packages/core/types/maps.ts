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
	IColumn,
	ILinkToPage
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
	IColumnListInput,
	ILinkToPageInput
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
	link_to_page: Map<string, Block<ILinkToPage, ILinkToPageInput>>;
	embed: Map<string, Block<IEmbed, IEmbedInput>>;
	video: Map<string, Block<IVideo, IVideoInput>>;
	audio: Map<string, Block<IAudio, IAudioInput>>;
	image: Map<string, Block<IImage, IImageInput>>;
	bookmark: Map<string, Block<IWebBookmark, IWebBookmarkInput>>;
	code: Map<string, Block<ICode, ICodeInput>>;
	file: Map<string, Block<IFile, IFileInput>>;
	tweet: Map<string, Block<ITweet, ITweetInput>>;
	gist: Map<string, Block<IGist, IGistInput>>;
	codepen: Map<string, Block<ICodepen, ICodepenInput>>;
	maps: Map<string, Block<IMaps, IMapsInput>>;
	figma: Map<string, Block<IFigma, IFigmaInput>>;
	drive: Map<string, Block<IDrive, IDriveInput>>;
	text: Map<string, Block<IText, ITextInput>>;
	table_of_contents: Map<string, Block<ITOC, ITOCInput>>;
	equation: Map<string, Block<IEquation, IEquationInput>>;
	breadcrumb: Map<string, Block<IBreadcrumb, IBreadcrumbInput>>;
	factory: Map<string, Block<IFactory, IFactoryInput>>;
	page: Map<string, Page>;
	to_do: Map<string, Block<ITodo, ITodoInput>>;
	header: Map<string, Block<IHeader, IHeaderInput>>;
	sub_header: Map<string, Block<ISubHeader, ISubHeaderInput>>;
	sub_sub_header: Map<string, Block<ISubHeader, ISubHeaderInput>>;
	bulleted_list: Map<string, Block<IBulletedList, IBulletedListInput>>;
	numbered_list: Map<string, Block<INumberedList, INumberedListInput>>;
	toggle: Map<string, Block<IToggle, IToggleInput>>;
	quote: Map<string, Block<IQuote, IQuoteInput>>;
	divider: Map<string, Block<IDivider, IDividerInput>>;
	callout: Map<string, Block<ICallout, ICalloutInput>>;
	collection_view: Map<string, CollectionView>;
	collection_view_page: Map<string, CollectionViewPage>;
	linked_db: Map<string, CollectionView>;
	column_list: Map<string, Block<IColumnList, IColumnListInput>>;
	column: Map<string, Block<IColumn, any>>;
}
