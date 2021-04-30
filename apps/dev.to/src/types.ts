export interface ICreateBookmarkRowsParams {
  dev_to_cookie: string;
  notion_cookie: string;
  title?: string;
  parent_id: string;
  parent_table: 'collection' | 'block' | 'space';
  space_id: string;
  user_id: string;
}

export interface IUnauthenticatedApiError {
  errors: {
    message: 'Access denied! You need to be authorized to perform this action!';
    locations: [
      {
        line: number;
        column: number;
      }
    ];
    path: string[];
    extensions: {
      code: 'UNAUTHENTICATED';
    };
  }[];
  data: null;
}

export type TApiError = IUnauthenticatedApiError;

export interface IBookmarksFeedResponse {
  data: {
    page: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
      edges: {
        node: {
          id: string;
          title: string;
          createdAt: string;
          image: string;
          readTime: number | null;
          source: {
            id: string;
            name: string;
            image: string;
          };
          permalink: string;
          author: {
            name: string;
            image: string;
          } | null;
          read: boolean;
        };
      }[];
    };
  };
}
