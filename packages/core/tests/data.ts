import { LoadUserContentResult } from "../dist/types";

export default {
  "recordMap": {
    "notion_user": {
      "d94caf87-a207-45c3-b3d5-03d157b5b39b": {
        "role": "editor",
        "value": {
          "id": "d94caf87-a207-45c3-b3d5-03d157b5b39b",
          "version": 3,
          "email": "johndoe@gmail.com",
          "given_name": "John",
          "family_name": "Doe",
          "profile_photo": "https://img.john.doe.jpg",
          "onboarding_completed": true
        }
      }
    },
    "user_root": {
      "d94caf87-a207-45c3-b3d5-03d157b5b39b": {
        "role": "editor",
        "value": {
          "id": "d94caf87-a207-45c3-b3d5-03d157b5b39b",
          "version": 22,
          "space_views": [
            "ccfc7afe-c14f-4764-9a89-85659217eed7"
          ]
        }
      }
    },
    "user_settings": {
      "d94caf87-a207-45c3-b3d5-03d157b5b39b": {
        "role": "editor",
        "value": {
          "id": "d94caf87-a207-45c3-b3d5-03d157b5b39b",
          "version": 8,
          "settings": {
            "type": "personal",
            "locale": "en-US",
            "source": "friend",
            "persona": "student",
            "time_zone": "Asia/Dhaka",
            "signup_time": 1566572389109,
            "preferred_locale": "en-US",
            "used_desktop_web_app": true,
            "preferred_locale_origin": "legacy",
            "hide_referral_notification": true
          }
        }
      }
    },
    "space_view": {
      "ccfc7afe-c14f-4764-9a89-85659217eed7": {
        "role": "editor",
        "value": {
          "id": "ccfc7afe-c14f-4764-9a89-85659217eed7",
          "version": 4,
          "space_id": "d2498a62-99ed-4ffd-b56d-e986001729f4",
          "bookmarked_pages": [
            "4b4bb21d-f68b-4113-b342-830687a5337a"
          ],
          "parent_id": "d94caf87-a207-45c3-b3d5-03d157b5b39b",
          "parent_table": "user_root",
          "alive": true,
          "notify_mobile": true,
          "notify_desktop": true,
          "notify_email": true,
          "created_getting_started": true,
          "joined": true
        }
      }
    },
    "space": {
      "d2498a62-99ed-4ffd-b56d-e986001729f4": {
        "role": "editor",
        "value": {
          "id": "d2498a62-99ed-4ffd-b56d-e986001729f4",
          "version": 56,
          "name": "John",
          "permissions": [
            {
              "role": "editor",
              "type": "user_permission",
              "user_id": "d94caf87-a207-45c3-b3d5-03d157b5b39b"
            }
          ],
          "beta_enabled": false,
          "pages": [
            "4b4bb21d-f68b-4113-b342-830687a5337a",
            "6eae77bf-64cd-4ed0-adfb-e97d928a6402"
          ],
          "created_by": "d94caf87-a207-45c3-b3d5-03d157b5b39b",
          "created_time": 1566572400000,
          "last_edited_by": "d94caf87-a207-45c3-b3d5-03d157b5b39b",
          "last_edited_time": 1609505700000,
          "created_by_table": "notion_user",
          "created_by_id": "d94caf87-a207-45c3-b3d5-03d157b5b39b",
          "last_edited_by_table": "notion_user",
          "last_edited_by_id": "d94caf87-a207-45c3-b3d5-03d157b5b39b",
          "shard_id": 227383,
          "plan_type": "personal",
          "invite_link_code": "866cefd9532d61996c30dfb46166765a499eb7a6",
          "invite_link_enabled": false
        }
      }
    },
    "block": {
      "4b4bb21d-f68b-4113-b342-830687a5337a": {
        "role": "editor",
        "value": {
          "id": "4b4bb21d-f68b-4113-b342-830687a5337a",
          "version": 23,
          "type": "collection_view_page",
          "view_ids": [
            "451a024a-f6f8-476d-9a5a-1c98ffdf5a38"
          ],
          "collection_id": "a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b",
          "permissions": [
            {
              "role": "editor",
              "type": "user_permission",
              "user_id": "d94caf87-a207-45c3-b3d5-03d157b5b39b"
            },
            {
              "role": "read_and_write",
              "type": "user_permission",
              "user_id": "ac853891-9600-4dbe-ad42-4f8487df9bec"
            }
          ],
          "created_time": 1602390407523,
          "last_edited_time": 1609505580000,
          "parent_id": "d2498a62-99ed-4ffd-b56d-e986001729f4",
          "parent_table": "space",
          "alive": true,
          "created_by_table": "notion_user",
          "created_by_id": "d94caf87-a207-45c3-b3d5-03d157b5b39b",
          "last_edited_by_table": "notion_user",
          "last_edited_by_id": "d94caf87-a207-45c3-b3d5-03d157b5b39b",
          "shard_id": 227383,
          "space_id": "d2498a62-99ed-4ffd-b56d-e986001729f4"
        }
      },
      "6eae77bf-64cd-4ed0-adfb-e97d928a6402": {
        "role": "editor",
        "value": {
          "id": "6eae77bf-64cd-4ed0-adfb-e97d928a6402",
          "version": 16,
          "type": "page",
          "properties": {
            "title": [
              [
                "Page"
              ]
            ]
          },
          "content": [
            "041173d7-8168-42b9-9440-c0b287573da9"
          ],
          "permissions": [
            {
              "role": "editor",
              "type": "user_permission",
              "user_id": "d94caf87-a207-45c3-b3d5-03d157b5b39b"
            }
          ],
          "created_time": 1609505700000,
          "last_edited_time": 1609505700000,
          "parent_id": "d2498a62-99ed-4ffd-b56d-e986001729f4",
          "parent_table": "space",
          "alive": true,
          "created_by_table": "notion_user",
          "created_by_id": "d94caf87-a207-45c3-b3d5-03d157b5b39b",
          "last_edited_by_table": "notion_user",
          "last_edited_by_id": "d94caf87-a207-45c3-b3d5-03d157b5b39b",
          "shard_id": 227383,
          "space_id": "d2498a62-99ed-4ffd-b56d-e986001729f4"
        }
      }
    },
    "collection": {
      "a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b": {
        "role": "editor",
        "value": {
          "id": "a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b",
          "version": 89,
          "name": [
            [
              "Collection View Page"
            ]
          ],
          "schema": {
            ";pxx": {
              "name": "Date",
              "type": "date"
            },
            "title": {
              "name": "Name",
              "type": "title"
            }
          },
          "parent_id": "4b4bb21d-f68b-4113-b342-830687a5337a",
          "parent_table": "block",
          "alive": true,
          "migrated": true
        }
      }
    }
  }
} as LoadUserContentResult