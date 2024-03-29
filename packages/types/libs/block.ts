import {
  IPermission,
  IPointer,
  ISpace,
  Schema,
  TCodeLanguage,
  TFormatBlockColor,
  TTextFormat
} from '.';
import { ViewFormatProperties } from './view';
export interface NotionNode {
  alive: boolean;
  version: number;
  id: string;
}
export interface ParentProps {
  parent_id: string;
  parent_table: 'block' | 'space' | 'user_root' | 'collection';
}
export interface CreatedProps {
  created_by_id: string;
  created_by_table: 'notion_user';
  created_time: number;
}
export interface LastEditedProps {
  last_edited_by_id: string;
  last_edited_by_table: 'notion_user';
  last_edited_time: number;
}
export interface SpaceProps {
  space_id: string;
}
export interface IBlock
  extends SpaceProps,
    NotionNode,
    ParentProps,
    CreatedProps,
    LastEditedProps {
  copied_from?: string;
  discussions?: string[];
}
export declare type TMediaBlockType = TMediaBlock['type'];
export declare type TBasicBlockType = TBasicBlock['type'];
export declare type TAdvancedBlockType = TAdvancedBlock['type'];
export declare type TEmbedBlockType = TEmbedBlock['type'];
export declare type TCollectionBlockType =
  | 'collection_view_page'
  | 'collection_view'
  | 'linked_db';
export declare type TColumnBlockType = 'column_list' | 'column';
export declare type TBlockType =
  | TEmbedBlockType
  | TMediaBlockType
  | TBasicBlockType
  | TAdvancedBlockType
  | TCollectionBlockType
  | TColumnBlockType;
export interface MediaProps {
  source: string[][];
  size?: string[][];
  title?: string[][];
  caption?: TTextFormat;
}
export interface MediaFormat {
  block_aspect_ratio?: number;
  block_full_width?: boolean;
  block_page_width?: boolean;
  block_preserve_scale?: boolean;
  block_width?: number;
  block_height?: number;
  display_source: string;
}
export interface WebBookmarkFormat {
  bookmark_cover: string;
  bookmark_icon: string;
  block_color?: TFormatBlockColor;
}
export interface WebBookmarkProps {
  link: string[][];
  description?: TTextFormat;
  title: TTextFormat;
  caption?: TTextFormat;
}
export interface CodeFormat {
  code_wrap: boolean;
}
export interface CodeProps {
  title: TTextFormat;
  language: [[TCodeLanguage]];
  caption: TTextFormat;
}
export interface FileProps {
  title: TTextFormat;
  source: string[][];
  caption?: TTextFormat;
}
export interface FileFormat {
  block_color?: TFormatBlockColor;
}
export interface TodoProps {
  title: TTextFormat;
  checked: ('Yes' | 'No')[][];
}
export interface IMedia {
  properties: MediaProps;
  format?: MediaFormat;
  file_ids: string[];
}
export interface ICommonText<F = Record<string, unknown>> {
  properties: {
    title: TTextFormat;
  };
  format?: {
    block_color?: TFormatBlockColor;
    copied_from_pointer?: IPointer;
  } & F;
}
export interface IVideo extends IBlock, IMedia {
  type: 'video';
}
export interface IAudio extends IBlock, IMedia {
  type: 'audio';
}
export interface IImage extends IBlock, IMedia {
  type: 'image';
}
export interface IWebBookmark extends IBlock {
  type: 'bookmark';
  properties: WebBookmarkProps;
  format?: WebBookmarkFormat;
}
export interface ICode extends IBlock {
  type: 'code';
  properties: CodeProps;
  format?: CodeFormat;
}
export interface IFile extends IBlock {
  type: 'file';
  properties: FileProps;
  format?: FileFormat;
}
export declare type TMediaBlock =
  | IVideo
  | IAudio
  | IImage
  | IWebBookmark
  | ICode
  | IFile;
export interface PageProps {
  title: TTextFormat;
  [k: string]: TTextFormat;
}
export interface PageFormat {
  page_icon?: string;
  page_font?: null | 'mono' | 'serif';
  page_full_width?: boolean;
  page_small_text?: boolean;
  block_locked_by?: string;
  block_locked?: boolean;
  page_cover?: string;
  page_cover_position?: number;
  block_color?: TFormatBlockColor;
  page_section_visibility?: {
    backlinks: 'section_show' | 'section_hide' | 'section_collapsed';
    comments: 'section_hide' | 'section_show';
  };
}
export interface IPage extends IBlock {
  properties: PageProps;
  type: 'page';
  content: string[];
  format?: PageFormat;
  is_template?: boolean;
  file_ids?: string[];
  permissions: IPermission[];
}
export interface IColumnFormat {
  format: {
    column_ratio: number;
  };
}
export interface IColumn
  extends NotionNode,
    ParentProps,
    CreatedProps,
    LastEditedProps,
    IColumnFormat,
    SpaceProps {
  content: string[];
  type: 'column';
  properties?: Record<string, unknown>;
}
export interface IColumnList
  extends NotionNode,
    ParentProps,
    CreatedProps,
    LastEditedProps,
    SpaceProps {
  content: string[];
  type: 'column_list';
  format?: Record<string, unknown>;
  properties?: Record<string, unknown>;
}
export interface ICollectionBlock extends IBlock {
  format: {
    block_locked_by?: string;
    block_locked?: boolean;
  };
  view_ids: string[];
  collection_id: string;
  type: 'collection_view' | 'collection_view_page';
}
export interface ICollectionView extends ICollectionBlock {
  type: 'collection_view';
}
export interface ICollectionViewPage extends ICollectionBlock {
  type: 'collection_view_page';
  permissions: IPermission[];
}
export declare type TCollectionBlock = ICollectionView | ICollectionViewPage;
export interface IText extends IBlock, ICommonText {
  type: 'text';
}
export interface ITodo extends IBlock {
  type: 'to_do';
  properties?: TodoProps;
  format?: {
    block_color?: TFormatBlockColor;
  };
  content?: string[];
}
export interface IHeader extends IBlock, ICommonText {
  type: 'header';
}
export interface ISubHeader extends IBlock, ICommonText {
  type: 'sub_header';
}
export interface ISubSubHeader extends IBlock, ICommonText {
  type: 'sub_sub_header';
}
export interface IBulletedList extends IBlock, ICommonText {
  type: 'bulleted_list';
  content?: string[];
}
export interface INumberedList
  extends IBlock,
    ICommonText<{
      list_start_index?: number;
      list_format?: 'numbers' | 'letters' | 'roman';
    }> {
  type: 'numbered_list';
  content?: string[];
}
export interface IToggle extends IBlock, ICommonText {
  content?: string[];
  type: 'toggle';
}
export interface IQuote
  extends IBlock,
    ICommonText<{
      quote_size?: 'large';
    }> {
  type: 'quote';
  content?: string[];
}
export interface IDivider extends IBlock {
  type: 'divider';
  properties?: Record<string, unknown>;
  format?: Record<string, unknown>;
}
export interface ICallout extends IBlock {
  type: 'callout';
  properties?: {
    title: TTextFormat;
  };
  format?: {
    block_color?: TFormatBlockColor;
    copied_from_pointer?: IPointer;
    page_icon: string;
  };
  content?: string[];
}
export interface IAlias extends IBlock {
  type: 'alias';
  format: {
    alias_pointer: IPointer;
  };
}
export declare type TBasicBlock =
  | IAlias
  | IText
  | ITodo
  | IHeader
  | ISubHeader
  | ISubSubHeader
  | IBulletedList
  | INumberedList
  | IToggle
  | IQuote
  | IDivider
  | ICallout
  | IPage
  | TCollectionBlock;
export interface IToc extends IBlock {
  type: 'table_of_contents';
  format?: {
    block_color?: TFormatBlockColor;
  };
  properties?: Record<string, unknown>;
}
export interface IEquation extends IBlock {
  type: 'equation';
  properties: {
    title: TTextFormat;
  };
  format?: {
    block_color?: TFormatBlockColor;
  };
}
export interface IBreadcrumb extends IBlock {
  type: 'breadcrumb';
  properties?: Record<string, unknown>;
  format?: Record<string, unknown>;
}
export interface IFactory extends IBlock {
  type: 'factory';
  properties: {
    title: TTextFormat;
  };
  format?: {
    block_color?: TFormatBlockColor;
  };
  content: string[];
}
export interface ITransclusionContainer extends IBlock {
  type: 'transclusion_container';
  content?: string[];
}
export interface ITransclusionReference extends IBlock {
  type: 'transclusion_reference';
  format?: {
    copied_from_pointer?: IPointer;
    transclusion_reference_pointer?: IPointer;
  };
  copied_from?: string;
}
export declare type TTransclusionBlock =
  | ITransclusionReference
  | ITransclusionContainer;
export declare type TAdvancedBlock =
  | TTransclusionBlock
  | IToc
  | IEquation
  | IBreadcrumb
  | IFactory;
export interface IEmbedBlock extends IBlock {
  properties: MediaProps;
  format?: MediaFormat;
  type: TEmbedBlockType;
}
export interface IEmbed extends IEmbedBlock {
  type: 'embed';
}
export interface ICodepen extends IEmbedBlock {
  type: 'codepen';
}
export interface IMaps extends IEmbedBlock {
  type: 'maps';
}
export interface IFigma extends IEmbedBlock {
  type: 'figma';
}
export interface IGist extends IEmbedBlock {
  type: 'gist';
}
export interface IAbstract extends IEmbedBlock {
  type: 'abstract';
}
export interface IInvision extends IEmbedBlock {
  type: 'invision';
}
export interface IFramer extends IEmbedBlock {
  type: 'framer';
}
export interface IWhimsical extends IEmbedBlock {
  type: 'whimsical';
}
export interface IMiro extends IEmbedBlock {
  type: 'miro';
}
export interface IPdf extends IEmbedBlock {
  type: 'pdf';
}
export interface ILoom extends IEmbedBlock {
  type: 'loom';
}
export interface ITypeform extends IEmbedBlock {
  type: 'typeform';
}
export interface IDrive extends IBlock {
  type: 'drive';
  properties?: Record<string, unknown>;
  format?: {
    drive_properties: {
      file_id: string;
      icon: string;
      modified_time: number;
      title: string;
      trashed: boolean;
      url: string;
      user_name: string;
    };
    drive_status: {
      authed: boolean;
      last_fetched: number;
    };
  };
  file_id?: string;
}
export interface ITweet extends IBlock {
  type: 'tweet';
  properties: {
    source: string[][];
  };
  format?: Record<string, unknown>;
}
export declare type TEmbedBlock =
  | IEmbed
  | ITweet
  | ICodepen
  | IMaps
  | IFigma
  | IDrive
  | IGist
  | IAbstract
  | IInvision
  | ILoom
  | IFramer
  | IWhimsical
  | IMiro
  | IPdf
  | ITypeform;
export declare type TBlock =
  | TBasicBlock
  | TMediaBlock
  | TAdvancedBlock
  | TEmbedBlock
  | IColumnList
  | IColumn;
export declare type TParentType = IPage | ISpace | ICollectionViewPage;
export declare type TPropertyVisibility = 'show' | 'hide_if_empty' | 'hide';
export declare type CollectionFormatPropertyVisibility = {
  property: string;
  visibility: 'show' | 'hide_if_empty' | 'hide';
};
export interface ICollection extends NotionNode, ParentProps {
  description?: TTextFormat;
  icon?: string;
  cover?: string;
  migrated: boolean;
  name: TTextFormat;
  schema: Schema;
  template_pages?: string[];
  format?: {
    property_visibility?: CollectionFormatPropertyVisibility[];
    page_section_visibility?: PageFormat['page_section_visibility'];
    collection_page_properties?: ViewFormatProperties[];
  };
}
export declare type TPage = IPage | ICollectionViewPage;
