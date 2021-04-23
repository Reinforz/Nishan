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
        query: `
          query BookmarksFeed($loggedIn: Boolean! = true, $first: Int, $after: String) {
            page: bookmarksFeed(first: $first, after: $after) {
              ...FeedPostConnection
            }
          }
          
          fragment FeedPostConnection on PostConnection {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                ...FeedPost
                ...UserPost @include(if: $loggedIn)
              }
            }
          }
          
          fragment FeedPost on Post {
            id
            title
            createdAt
            image
            readTime
            source {
              id
              name
              image
            }
            permalink
            author {
              name
              image
            }
          }
          
          fragment UserPost on Post {
            read
          }
        `,
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
    } else if("data" in response.data){
      const schema: ICollectionBlockInput["schema"] = [{
        name: "Title",
        type: "title",
      }, {
        name: "Image",
        type: "url",
        schema_id: 'image',
      }, {
        name: "Link",
        type: "url",
        schema_id: 'link',
      }, {
        name: "Read Time",
        type: "number",
        schema_id: 'read_time',
      }, {
        name: "Source",
        type: "text",
        schema_id: 'source',
      }, {
        name: "Author",
        type: "text",
        schema_id: 'author',
      }];

      try{
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
                format: 500,
              }, {
                name: "Image",
                type: "url",
                format: false
              }, {
                name: "Link",
                type: "url",
                format: 250,
              }, {
                name: "Read Time",
                type: "number",
                format: 50
              }, {
                name: "Source",
                type: "text",
                format: 150
              }, {
                name: "Author",
                type: "text",
                format: 150
              }]
            }
          ],
          rows: response.data.data.page.edges.map(edge=>({
            type: "page",
            properties: {
              title: [[edge.node.title]],
              image: [[edge.node.image]],
              read_time: [[(edge.node.readTime ?? 0).toString()]],
              source: [[edge.node.source.name]],
              link: [[edge.node.permalink]],
              author: [[edge.node.author?.name ?? '']],
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
      }catch(err){
        console.log(err)
      }
    }
  }catch(err){
    console.log(err)
  }
}
