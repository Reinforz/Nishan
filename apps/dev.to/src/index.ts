import axios from 'axios';
import { ICreateBookmarkRowsParams } from './types';

export * from './types';

export async function createBookmarkRows (options: ICreateBookmarkRowsParams) {
	const response = await axios.post(
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
	console.log(response.data.data);
}
