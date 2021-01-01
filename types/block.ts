import { ISpace, TCreditType, TFormatBlockColor, TCodeLanguage, IBlock, LastEditedProps, Schema, TSchemaUnit, IPermission, TPermissionRole, TSearchManipViewParam, Node, ParentProps, CreateProps, SpaceShardProps } from ".";

export type TGenericEmbedBlockType = "figma" | "tweet" | "codepen" | "gist" | "maps";
export type TMediaBlockType = 'code' | 'image' | 'video' | 'bookmark' | 'audio' | 'file';
export type TBasicBlockType = 'page' | 'text' | 'header' | 'sub_header' | 'sub_sub_header' | 'to_do' | 'bulleted_list' | 'numbered_list' | 'toggle' | 'quote' | 'divider' | 'callout' | 'link_to_page';
export type TAdvancedBlockType = 'table_of_contents' | 'equation' | 'factory' | 'breadcrumb';
export type TEmbedsBlockType = 'embed' | 'drive' | TGenericEmbedBlockType;
export type TCollectionBlockType = 'collection_view_page' | 'collection_view' | 'linked_db';
export type TColumnBlockType = 'column_list' | 'column';
export type TBlockType = TEmbedsBlockType | TMediaBlockType | TBasicBlockType | TAdvancedBlockType | TCollectionBlockType | TColumnBlockType;

interface IInput {
  id?: string,
  type: TBlockType
}

export interface MediaProps {
  source: string[][],
  caption?: string[][]
}

export interface MediaFormat {
  block_aspect_ratio?: number,
  block_full_width?: boolean,
  block_page_width?: boolean,
  block_preserve_scale?: boolean,
  block_width?: number,
  block_height?: number,
  display_source: string
}

export interface WebBookmarkFormat {
  bookmark_cover: string,
  bookmark_icon: string,
  block_color?: TFormatBlockColor
}

export interface WebBookmarkProps {
  link: string[][],
  description: string[][],
  title: string[][],
  caption?: string[][]
}

export interface CodeFormat {
  code_wrap: boolean
}

export interface CodeProps {
  title: string[][],
  language: TCodeLanguage
}

export interface FileProps {
  title: string[][],
  source: string[][],
  caption?: string[][]
}

export interface FileFormat {
  block_color?: TFormatBlockColor
}

export interface TodoProps {
  title: string[][],
  checked: ("Yes" | "No")[][]
}

export interface ICollectionBlockInput extends IInput {
  views: [TSearchManipViewParam, ...TSearchManipViewParam[]],
  schema: TSchemaUnit[],
  properties: PageProps,
  format?: Partial<PageFormat>,
  rows?: Omit<IPageCreateInput, "type">[]
}

export interface ICollectionViewInput extends ICollectionBlockInput {
  type: "collection_view",
}

export interface ICollectionViewPageInput extends ICollectionBlockInput {
  type: "collection_view_page",
  isPrivate?: boolean
}

export interface ILinkedDBInput extends IInput {
  type: "linked_db",
  collection_id: string,
  properties?: Record<string, unknown>,
  format?: Record<string, unknown>,
  views: TSearchManipViewParam[],
}

export type TCollectionBlockInput = ICollectionViewInput | ICollectionViewPageInput | ILinkedDBInput;

// -----------------

// Media IBlock Input
export interface IMediaInput extends IInput {
  properties: MediaProps,
  format?: MediaFormat,
  file_ids: string[]
}

export interface IVideoInput extends IMediaInput {
  type: 'video',
}

export interface IImageInput extends IMediaInput {
  type: 'image',
}

export interface IAudioInput extends IMediaInput {
  type: 'audio',
}

export interface IWebBookmarkInput extends IInput {
  type: 'bookmark',
  properties: WebBookmarkProps,
  format?: WebBookmarkFormat
}

// Basic block input
export interface ICodeInput extends IInput {
  type: 'code',
  properties: CodeProps,
  format?: CodeFormat
}

export interface IFileInput extends IInput {
  type: 'file',
  properties: FileProps,
  format?: FileFormat
}

export type TMediaBlockInput = IVideoInput | IImageInput | IAudioInput | IWebBookmarkInput | ICodeInput | IFileInput;

// Basic IBlock Input

export interface IColumnListInput extends IInput {
  type: "column_list",
  properties?: Record<string, unknown>,
  format?: Record<string, unknown>,
  contents: TBlockInput[]
}

export interface IPageCreateInput extends IInput {
  type: 'page',
  properties: PageProps,
  format?: Partial<PageFormat>,
  isPrivate?: boolean,
  contents?: TBlockInput[]
}

export type IPageUpdateInput = Partial<Omit<IPageCreateInput, "contents">>;
export type ICollectionViewPageUpdateInput = Partial<Pick<ICollectionViewPage, "properties" | "format">>
export interface ICommonTextInput extends IInput {
  properties: {
    title: string[][]
  },
  format?: {
    block_color?: TFormatBlockColor
  }
}
export interface ILinkToPageInput extends IInput {
  type: "link_to_page",
  page_id: string,
  format?: Record<string, unknown>,
  properties?: Record<string, unknown>
}

export interface ITextInput extends ICommonTextInput {
  type: 'text'
}

export interface IHeaderInput extends ICommonTextInput {
  type: 'header'
}

export interface ISubHeaderInput extends ICommonTextInput {
  type: 'sub_header'
}

export interface ISubSubHeaderInput extends ICommonTextInput {
  type: 'sub_sub_header'
}

export interface INumberedListInput extends ICommonTextInput {
  type: 'numbered_list'
}

export interface IBulletedListInput extends ICommonTextInput {
  type: 'bulleted_list'
}

export interface IToggleInput extends ICommonTextInput {
  type: 'toggle'
}

export interface IQuoteInput extends ICommonTextInput {
  type: 'quote'
}

export interface IDividerInput extends IInput {
  type: 'divider',
  properties?: Record<string, unknown>,
  format?: Record<string, unknown>
}

export interface ICalloutInput extends ICommonTextInput {
  type: 'callout',
  format?: {
    page_icon: string,
    block_color?: TFormatBlockColor
  }
}

export interface ITodoInput extends IInput {
  type: 'to_do',
  properties: TodoProps,
  format?: {
    block_color?: TFormatBlockColor
  }
}
// ? TD:2:M Add td for TCollectionBlockInput

export type TBasicBlockInput = ILinkToPageInput | IPageCreateInput | ITodoInput | ICalloutInput | IDividerInput | IQuoteInput | IToggleInput | IBulletedListInput | INumberedListInput | ISubSubHeaderInput | ISubHeaderInput | IHeaderInput | ITextInput;
// Advanced block input
export interface ITOCInput extends IInput {
  type: 'table_of_contents',
  format?: {
    block_color?: TFormatBlockColor
  },
  properties?: Record<string, unknown>
}

export interface IEquationInput extends IInput {
  type: 'equation',
  properties: {
    title: string[][]
  },
  format?: {
    block_color?: TFormatBlockColor
  }
}

export interface IFactoryInput extends IInput {
  type: 'factory',
  properties: {
    title: string[][]
  },
  format?: {
    block_color?: TFormatBlockColor
  },
  contents: TBlockInput[]
}

export interface IBreadcrumbInput extends IInput {
  type: 'breadcrumb',
  properties?: Record<string, unknown>,
  format?: Record<string, unknown>,
}

export type TAdvancedBlockInput = IBreadcrumbInput | IFactoryInput | IEquationInput | ITOCInput;

// Embed block input
export interface IEmbedInput extends IInput {
  type: "embed",
  properties: MediaProps,
  format?: MediaFormat,
}

export interface IDriveInput extends IInput {
  type: 'drive',
  properties?: Record<string, unknown>,
  format?: {
    drive_properties: {
      file_id: string,
      icon: string,
      modified_time: number,
      title: string,
      trashed: boolean,
      url: string,
      user_name: string,
    },
    drive_status: {
      authed: boolean,
      last_fetched: number
    }
  },
  file_id: string
}

export interface ITweetInput extends IInput {
  type: 'tweet',
  properties: {
    source: string[][]
  },
  format?: Record<string, unknown>,
}

export interface ICodepenInput extends IInput {
  type: 'codepen',
  properties: {
    source: string[][]
  },
  format?: MediaFormat,
}

export interface IMapsInput extends IInput {
  type: 'maps',
  properties: {
    source: string[][]
  },
  format?: MediaFormat,
}

export interface IGistInput extends IInput {
  type: 'gist',
  properties: {
    source: string[][]
  },
  format?: {
    block_color?: TFormatBlockColor,
    display_source: null
  },
}

export interface IFigmaInput extends IInput {
  type: 'figma',
  properties: {
    source: string[][]
  },
  format?: MediaFormat,
}

export type TEmbedBlockInput = IEmbedInput | IFigmaInput | IMapsInput | ICodepenInput | IDriveInput | IGistInput | ITweetInput;

export type TBlockInput = TMediaBlockInput | TBasicBlockInput | TAdvancedBlockInput | TEmbedBlockInput | TCollectionBlockInput | IColumnListInput;
// -----------------

// Media IBlock Types
export interface IVideo extends IBlock, Omit<IVideoInput, "id"> { };
export interface IAudio extends IBlock, Omit<IAudioInput, "id"> { };
export interface IImage extends IBlock, Omit<IImageInput, "id"> { };
export interface IWebBookmark extends IBlock, Omit<IWebBookmarkInput, "id"> { };
export interface ICode extends IBlock, Omit<ICodeInput, "id"> { };
export interface IFile extends IBlock, Omit<IFileInput, "id"> { };

export type TMediaBlock = IVideo | IAudio | IImage | IWebBookmark | ICode | IFile;

// Basic IBlock Types
export interface PageProps {
  title: string[][],
  [k: string]: string[][]
}

export interface PageFormat {
  page_icon: string,
  page_font: string,
  page_full_width: boolean,
  page_small_text: boolean,
  block_locked_by: string,
  block_locked: boolean,
  page_cover: string,
  page_cover_position: number,
  block_color?: TFormatBlockColor,
  page_section_visibility: {
    backlinks: "section_show" | "section_hide" | "section_collapsed",
    comments: "section_hide" | "section_show"
  }
}

export interface IPage extends IBlock {
  properties: PageProps,
  type: 'page',
  content: string[],
  format?: PageFormat,
  is_template?: boolean,
  file_ids?: string[],
  permissions: IPermission[]
}

export interface IColumnFormat {
  format: {
    column_ratio: 0.5
  }
}
export interface IColumn extends Node, ParentProps, CreateProps, LastEditedProps, IColumnFormat, SpaceShardProps {
  content: string[],
  type: "column",
  properties?: Record<string, unknown>
}

export interface IColumnList extends Node, ParentProps, CreateProps, LastEditedProps, SpaceShardProps {
  content: string[],
  type: "column_list",
  format?: Record<string, unknown>,
  properties?: Record<string, unknown>
}

export interface ICollectionBlock extends IBlock {
  view_ids: string[],
  collection_id: string,
  type: 'collection_view' | 'collection_view_page',
  properties?: Record<string, unknown>,
  format?: Record<string, unknown>,
}

export interface ICollectionView extends ICollectionBlock {
  type: 'collection_view',
}

export interface ICollectionViewPage extends ICollectionBlock {
  type: 'collection_view_page',
  permissions: IPermission[]
}

export type TCollectionBlock = ICollectionView | ICollectionViewPage;

export interface IText extends Omit<ITextInput, "id">, IBlock { }
export interface ITodo extends Omit<ITodoInput, "id">, IBlock { }
export interface IHeader extends Omit<IHeaderInput, "id">, IBlock { }
export interface ISubHeader extends Omit<ISubHeaderInput, "id">, IBlock { }
export interface ISubSubHeader extends Omit<ISubSubHeaderInput, "id">, IBlock { }
export interface IBulletedList extends Omit<IBulletedListInput, "id">, IBlock { }
export interface INumberedList extends Omit<INumberedListInput, "id">, IBlock { }
export interface IToggle extends Omit<IToggleInput, "id">, IBlock { }
export interface IQuote extends Omit<IQuoteInput, "id">, IBlock { }
export interface IDivider extends Omit<IDividerInput, "id">, IBlock { }
export interface ICallout extends Omit<ICalloutInput, "id">, IBlock { }

export type TBasicBlock = IText | ITodo | IHeader | ISubHeader | ISubSubHeader | IBulletedList | INumberedList | IToggle | IQuote | IDivider | ICallout | IPage | TCollectionBlock;

// Advanced block types
export interface ITOC extends Omit<ITOCInput, "id">, IBlock { };
export interface IEquation extends Omit<IEquationInput, "id">, IBlock { };
export interface IBreadcrumb extends Omit<IBreadcrumbInput, "id">, IBlock { };
export interface IFactory extends IBlock {
  type: 'factory',
  properties: {
    title: string[][]
  },
  format?: {
    block_color?: TFormatBlockColor
  },
  contents: string[]
}

export type TAdvancedBlock = ITOC | IEquation | IBreadcrumb | IFactory;

// Embeds Type
export interface IGist extends IBlock, Omit<IGistInput, "id"> { }
export interface IDrive extends IBlock, Omit<IDriveInput, "id"> { }
export interface ITweet extends IBlock, Omit<ITweetInput, "id"> { }
export interface IEmbed extends IBlock, Omit<IEmbedInput, "id"> { }
export interface ICodepen extends IBlock, Omit<ICodepenInput, "id"> { }
export interface IMaps extends IBlock, Omit<IMapsInput, "id"> { }
export interface IFigma extends IBlock, Omit<IFigmaInput, "id"> { }

export type TEmbedBlock = IEmbed | ITweet | ICodepen | IMaps | IFigma | IDrive | IGist;

export type TBlock = TBasicBlock | TMediaBlock | TAdvancedBlock | TEmbedBlock | IColumnList | IColumn;

export type TParentType = IPage | ISpace | ICollectionViewPage;

export interface ICollection extends Node, ParentProps {
  description: string[][],
  icon?: string,
  migrated: boolean,
  name: string[][],
  schema: Schema,
  template_pages?: string[]
}

export interface IMember {
  userId: string,
  role: TPermissionRole,
  guestPageIds: string[]
}

export interface ICredit {
  activated: boolean
  amount: number
  created_timestamp: string
  id: string
  type: TCreditType
  user_id: string
  version: number
}