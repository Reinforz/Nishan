import { CollectionViewPage, Page, SchemaUnit, TableView, GalleryView, ListView, BoardView, TimelineView, CalendarView, Block, Collection } from "./api";
import CollectionBlock from "./api/CollectionBlock";

import { CheckboxSchemaUnit, CreatedBySchemaUnit, CreatedTimeSchemaUnit, DateSchemaUnit, EmailSchemaUnit, FileSchemaUnit, FormulaSchemaUnit, IAudio, IAudioInput, IBreadcrumb, IBreadcrumbInput, IBulletedList, IBulletedListInput, ICallout, ICalloutInput, ICode, ICodeInput, ICodepen, ICodepenInput, IColumn, IColumnList, IColumnListInput, IDivider, IDividerInput, IDrive, IDriveInput, IEmbed, IEmbedInput, IEquation, IEquationInput, IFactory, IFactoryInput, IFigma, IFigmaInput, IFile, IFileInput, IGist, IGistInput, IHeader, IHeaderInput, IImage, IImageInput, IMaps, IMapsInput, INumberedList, INumberedListInput, IQuote, IQuoteInput, ISubHeader, ISubHeaderInput, IText, ITextInput, ITOC, ITOCInput, ITodo, ITodoInput, IToggle, IToggleInput, ITweet, ITweetInput, IVideo, IVideoInput, IWebBookmark, IWebBookmarkInput, LastEditedBySchemaUnit, LastEditedTimeSchemaUnit, MultiSelectSchemaUnit, NumberSchemaUnit, PersonSchemaUnit, PhoneNumberSchemaUnit, RelationSchemaUnit, RollupSchemaUnit, SelectSchemaUnit, TextSchemaUnit, TitleSchemaUnit, UrlSchemaUnit } from "@nishan/types";

export interface ITPage {
  collection_view_page: CollectionViewPage[],
  page: Page[]
}

export interface ITSchemaUnit {
  text: SchemaUnit<TextSchemaUnit>[],
  number: SchemaUnit<NumberSchemaUnit>[],
  select: SchemaUnit<SelectSchemaUnit>[],
  multi_select: SchemaUnit<MultiSelectSchemaUnit>[],
  title: SchemaUnit<TitleSchemaUnit>[],
  date: SchemaUnit<DateSchemaUnit>[],
  person: SchemaUnit<PersonSchemaUnit>[],
  file: SchemaUnit<FileSchemaUnit>[],
  checkbox: SchemaUnit<CheckboxSchemaUnit>[],
  url: SchemaUnit<UrlSchemaUnit>[],
  email: SchemaUnit<EmailSchemaUnit>[],
  phone_number: SchemaUnit<PhoneNumberSchemaUnit>[],
  formula: SchemaUnit<FormulaSchemaUnit>[],
  relation: SchemaUnit<RelationSchemaUnit>[],
  rollup: SchemaUnit<RollupSchemaUnit>[],
  created_time: SchemaUnit<CreatedTimeSchemaUnit>[],
  created_by: SchemaUnit<CreatedBySchemaUnit>[],
  last_edited_time: SchemaUnit<LastEditedTimeSchemaUnit>[],
  last_edited_by: SchemaUnit<LastEditedBySchemaUnit>[],
}

export interface ITView {
  table: TableView[],
  gallery: GalleryView[],
  list: ListView[],
  board: BoardView[],
  timeline: TimelineView[],
  calendar: CalendarView[],
}

// ? TD:1:M Add link_to_page block tds
export interface ITBlock {
  link_to_page: Block<any, any>[],
  embed: Block<IEmbed, IEmbedInput>[],
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
    block: Block<IFactory, IFactoryInput>,
    contents: ITBlock
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
  collection_view: ITCollectionBlock[],
  collection_view_page: ITCollectionBlock[],
  linked_db: ITCollectionBlock[],
  column_list: Block<IColumnList, IColumnListInput>[],
  column: Block<IColumn, any>[]
}

export type ITCollectionBlock = {
  block: CollectionBlock,
  collection: Collection,
  views: ITView
}