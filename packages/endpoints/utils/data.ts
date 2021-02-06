import { GetSpacesResult, INotionUser, LoadUserContentResult, NotionUserData, TView, ViewData } from '@nishans/types';

export const ExternalNotionUser: INotionUser = {
	id: 'd94caf87-a207-45c3-b3d5-03d157b5b39c',
	version: 3,
	email: 'johndoe@gmail.com',
	given_name: 'John',
	family_name: 'Doe',
	profile_photo: 'https://img.john.doe.jpg',
	onboarding_completed: true
};

export const ExternalNotionUserData: NotionUserData = {
	'd94caf87-a207-45c3-b3d5-03d157b5b39c': {
		role: 'editor',
		value: ExternalNotionUser
	}
};
export const LoadUserContentData: LoadUserContentResult = {
	recordMap: {
		notion_user: {
			'd94caf87-a207-45c3-b3d5-03d157b5b39b': {
				role: 'editor',
				value: {
					id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b',
					version: 3,
					email: 'johndoe@gmail.com',
					given_name: 'John',
					family_name: 'Doe',
					profile_photo: 'https://img.john.doe.jpg',
					onboarding_completed: true
				}
			}
		},
		user_root: {
			'd94caf87-a207-45c3-b3d5-03d157b5b39b': {
				role: 'editor',
				value: {
					id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b',
					version: 22,
					space_views: [ 'ccfc7afe-c14f-4764-9a89-85659217eed7' ]
				}
			}
		},
		user_settings: {
			'd94caf87-a207-45c3-b3d5-03d157b5b39b': {
				role: 'editor',
				value: {
					id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b',
					version: 8,
					settings: {
						type: 'personal',
						locale: 'en-US',
						persona: 'student',
						time_zone: 'Asia/Dhaka',
						signup_time: 1566572389109,
						preferred_locale: 'en-US',
						used_desktop_web_app: true,
						preferred_locale_origin: 'legacy'
					}
				}
			}
		},
		space_view: {
			'ccfc7afe-c14f-4764-9a89-85659217eed7': {
				role: 'editor',
				value: {
					id: 'ccfc7afe-c14f-4764-9a89-85659217eed7',
					version: 4,
					space_id: 'd2498a62-99ed-4ffd-b56d-e986001729f4',
					bookmarked_pages: [ '4b4bb21d-f68b-4113-b342-830687a5337a' ],
					parent_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b',
					parent_table: 'user_root',
					alive: true,
					notify_mobile: true,
					notify_desktop: true,
					notify_email: true,
					created_getting_started: true,
					joined: true
				}
			}
		},
		space: {
			'd2498a62-99ed-4ffd-b56d-e986001729f4': {
				role: 'editor',
				value: {
					id: 'd2498a62-99ed-4ffd-b56d-e986001729f4',
					version: 56,
					name: 'John',
					permissions: [
						{
							role: 'editor',
							type: 'user_permission',
							user_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b'
						},
						{
							role: 'comment_only',
							type: 'user_permission',
							user_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39c'
						}
					],
					beta_enabled: false,
					pages: [ '4b4bb21d-f68b-4113-b342-830687a5337a', '6eae77bf-64cd-4ed0-adfb-e97d928a6402' ],
					created_time: 1566572400000,
					last_edited_time: 1609505700000,
					created_by_table: 'notion_user',
					created_by_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b',
					last_edited_by_table: 'notion_user',
					last_edited_by_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b',
					shard_id: 227383,
					plan_type: 'personal',
					invite_link_code: '866cefd9532d61996c30dfb46166765a499eb7a6',
					invite_link_enabled: false
				}
			}
		},
		block: {
			'4b4bb21d-f68b-4113-b342-830687a5337a': {
				role: 'editor',
				value: {
					id: '4b4bb21d-f68b-4113-b342-830687a5337a',
					version: 23,
					type: 'collection_view_page',
					view_ids: [ '451a024a-f6f8-476d-9a5a-1c98ffdf5a38' ],
					collection_id: 'a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b',
					permissions: [
						{
							role: 'editor',
							type: 'user_permission',
							user_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b'
						}
					],
					created_time: 1602390407523,
					last_edited_time: 1609505580000,
					parent_id: 'd2498a62-99ed-4ffd-b56d-e986001729f4',
					parent_table: 'space',
					alive: true,
					created_by_table: 'notion_user',
					created_by_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b',
					last_edited_by_table: 'notion_user',
					last_edited_by_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b',
					shard_id: 227383,
					space_id: 'd2498a62-99ed-4ffd-b56d-e986001729f4'
				}
			},
			'6eae77bf-64cd-4ed0-adfb-e97d928a6401': {
				role: 'editor',
				value: {
					id: '6eae77bf-64cd-4ed0-adfb-e97d928a6401',
					version: 16,
					type: 'header',
					properties: {
						title: [ [ 'Header' ] ]
					},
					created_time: 1609505700000,
					last_edited_time: 1609505700000,
					parent_id: '6eae77bf-64cd-4ed0-adfb-e97d928a6402',
					parent_table: 'block',
					alive: true,
					created_by_table: 'notion_user',
					created_by_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b',
					last_edited_by_table: 'notion_user',
					last_edited_by_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b',
					shard_id: 227383,
					space_id: 'd2498a62-99ed-4ffd-b56d-e986001729f4'
				}
			},
			'6eae77bf-64cd-4ed0-adfb-e97d928a6402': {
				role: 'editor',
				value: {
					id: '6eae77bf-64cd-4ed0-adfb-e97d928a6402',
					version: 16,
					type: 'page',
					properties: {
						title: [ [ 'Page' ] ]
					},
					content: [ '6eae77bf-64cd-4ed0-adfb-e97d928a6401' ],
					permissions: [
						{
							role: 'editor',
							type: 'user_permission',
							user_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b'
						}
					],
					created_time: 1609505700000,
					last_edited_time: 1609505700000,
					parent_id: 'd2498a62-99ed-4ffd-b56d-e986001729f4',
					parent_table: 'space',
					alive: true,
					created_by_table: 'notion_user',
					created_by_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b',
					last_edited_by_table: 'notion_user',
					last_edited_by_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b',
					shard_id: 227383,
					space_id: 'd2498a62-99ed-4ffd-b56d-e986001729f4'
				}
			},
			// row page
			'6eae77bf-64cd-4ed0-adfb-e97d928a6403': {
				role: 'editor',
				value: {
					id: '6eae77bf-64cd-4ed0-adfb-e97d928a6403',
					version: 16,
					type: 'page',
					properties: {
						title: [ [ 'Page' ] ]
					},
					content: [],
					permissions: [
						{
							role: 'editor',
							type: 'user_permission',
							user_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b'
						}
					],
					created_time: 1609505700000,
					last_edited_time: 1609505700000,
					parent_id: 'a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b',
					parent_table: 'collection',
					alive: true,
					created_by_table: 'notion_user',
					created_by_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b',
					last_edited_by_table: 'notion_user',
					last_edited_by_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b',
					shard_id: 227383,
					space_id: 'd2498a62-99ed-4ffd-b56d-e986001729f4'
				}
			},
			// template page
			'6eae77bf-64cd-4ed0-adfb-e97d928a6404': {
				role: 'editor',
				value: {
					id: '6eae77bf-64cd-4ed0-adfb-e97d928a6404',
					version: 16,
					type: 'page',
					properties: {
						title: [ [ 'Page' ] ]
					},
					content: [],
					permissions: [],
					created_time: 1609505700000,
					last_edited_time: 1609505700000,
					parent_id: 'a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b',
					parent_table: 'collection',
					alive: true,
					created_by_table: 'notion_user',
					created_by_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b',
					last_edited_by_table: 'notion_user',
					last_edited_by_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b',
					shard_id: 227383,
					space_id: 'd2498a62-99ed-4ffd-b56d-e986001729f4'
				}
			}
		},
		collection: {
			'a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b': {
				role: 'editor',
				value: {
					id: 'a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b',
					version: 89,
					cover: '',
					name: [ [ 'Collection View Page' ] ],
					schema: {
						';pxx': {
							name: 'Date',
							type: 'date'
						},
						title: {
							name: 'Name',
							type: 'title'
						}
					},
					template_pages: [ '6eae77bf-64cd-4ed0-adfb-e97d928a6404' ],
					parent_id: '4b4bb21d-f68b-4113-b342-830687a5337a',
					parent_table: 'block',
					alive: true,
					migrated: true
				}
			}
		}
	}
};

export const GetSpacesData: GetSpacesResult = {
	'd2498a62-99ed-4ffd-b56d-e986001729f4': {
		...LoadUserContentData.recordMap,
		collection_view: {
			'451a024a-f6f8-476d-9a5a-1c98ffdf5a38': {
				role: 'editor',
				value: {
					id: '451a024a-f6f8-476d-9a5a-1c98ffdf5a38',
					version: 4,
					type: 'table',
					name: 'All',
					format: {
						table_wrap: true,
						table_properties: [
							{
								width: 250,
								visible: true,
								property: 'title'
							},
							{
								width: 200,
								visible: true,
								property: 'CUyc'
							},
							{
								visible: true,
								property: 'LXec'
							}
						]
					},
					page_sort: [],
					parent_id: '4b4bb21d-f68b-4113-b342-830687a5337a',
					parent_table: 'block',
					alive: true,
					query2: {
						filter: {
							operator: 'and',
							filters: []
						}
					},
					shard_id: 731776,
					space_id: 'd2498a62-99ed-4ffd-b56d-e986001729f4'
				}
			}
		}
	}
};
