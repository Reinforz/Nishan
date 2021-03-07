import { gql } from 'apollo-server';

export const NotionGraphqlTypedefs = gql`
	scalar JSONObject

	union TParent = Page | Space

	union TPage = Page | CollectionViewPage

	union TCollectionBlock = CollectionViewPage | CollectionView

	union TBlock = CollectionViewPage | CollectionView | Page

	interface Block {
		type: String!
		id: String!
		parent: TParent!
		space: Space!
		last_edited_by: NotionUser!
		created_by: NotionUser!
	}

	type NotionUser {
		email: String!
		family_name: String!
		given_name: String!
		id: String!
		onboarding_completed: Boolean!
		profile_photo: String!
		version: Int!
	}

	type Space {
		id: String!
		name: String!
		pages: [TPage!]
		last_edited_by: NotionUser!
		created_by: NotionUser!
	}

	type View {
		id: String!
		name: String!
	}

	type CollectionViewPage implements Block {
		id: String!
		collection: Collection!
		parent: TParent!
		type: String!
		space: Space!
		last_edited_by: NotionUser!
		created_by: NotionUser!
		views: [View!]!
	}

	type CollectionView implements Block {
		id: String!
		type: String!
		collection: Collection!
		parent: TParent!
		space: Space!
		last_edited_by: NotionUser!
		created_by: NotionUser!
		views: [View!]!
	}

	type PageProperties {
		title: String!
	}

	type Page implements Block {
		properties: PageProperties!
		id: String!
		type: String!
		parent: TParent!
		space: Space!
		last_edited_by: NotionUser!
		created_by: NotionUser!
		contents: [TBlock!]!
	}

	type Collection {
		id: String!
		name: String!
		schema: JSONObject!
		parent: TCollectionBlock!
	}

	type Query {
		page(id: ID!): Page
		block(id: ID!): TBlock
		space(id: ID!): Space
	}
`;
