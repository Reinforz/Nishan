import { NotionCache } from '@nishans/cache';
import { ICollectionBlockInput, NotionFabricator } from '@nishans/fabricator';
import axios from 'axios';
import { IBookmarksFeedResponse, ICreateBookmarkRowsParams, TApiError } from './types';

export * from './types';

export async function createBookmarkRows (options: ICreateBookmarkRowsParams) {
  try{
    const response = await axios.post<TApiError | IBookmarksFeedResponse>(
      'https://api.daily.dev/graphql',
      {
        query:
          '\n  query BookmarksFeed(\n    $loggedIn: Boolean! = false\n    $first: Int\n    $after: String\n  ) {\n    page: bookmarksFeed(first: $first, after: $after) {\n      ...FeedPostConnection\n    }\n  }\n  \n  fragment FeedPostConnection on PostConnection {\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      node {\n        ...FeedPost\n        ...UserPost @include(if: $loggedIn)\n      }\n    }\n  }\n  \n  fragment FeedPost on Post {\n    id\n    title\n    createdAt\n    image\n    readTime\n    source {\n      id\n      name\n      image\n    }\n    permalink\n    numComments\n    numUpvotes\n    commentsPermalink\n    author {\n      name\n      image\n    }\n    featuredComments {\n      id\n      content\n      permalink\n      author {\n        name\n        image\n      }\n    }\n    trending\n  }\n\n  \n  fragment UserPost on Post {\n    read\n    upvoted\n    commented\n    bookmarked\n  }\n\n\n',
        variables: {
          first: 25,
          loggedIn: true,
          unreadOnly: false
        }
      },
      {
        headers: {
          cookie: options.dev_to_cookie
        }
      }
    );
    if("errors" in response.data){
      throw new Error(response.data.errors[0].message)
    }else if("page" in response.data){
      const schema: ICollectionBlockInput["schema"] = [{
        name: "Dev.to Id",
        type: "text",
      }, {
        name: "Title",
        type: "title"
      }];
      await NotionFabricator.CreateData.contents([{
        type: "collection_view_page",
        name: [[options.title ?? "Dev.to Bookmarks"]],
        schema,
        views: [
          {
            type: "table",
            name: "Table",
            schema_units: [{
              name: "Title",
              type: "title",
            }]
          }
        ],
        rows: response.data.page.edges.slice(0, 5).map(edge=>({
          type: "page",
          properties: {
            title: [[edge.node.title]],
          },
          contents: []
        }))
      }], options.parent_id, options.parent_table, {
        cache: NotionCache.createDefaultCache(),
        shard_id: options.shard_id,
        token: options.notion_cookie,
        space_id: options.space_id,
        user_id: options.user_id
      })
    
      console.log(schema);
    }
  }catch(err){
    console.log(err)
  }
}
