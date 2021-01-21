# Cache

Internal cache used inside `@nishans/core` to reduce the number of api calls to Notion's server

## Architecture

The cache is a simple object that contains the following keys. Here each key contains a map where the id is the key of the map and the data is the value of the map.

1. `block`: All notion blocks are stored in this key, checkout the `TBlockType` and `TBlock` inside `@nishans/types` to see which notion data constitutes a block. 
2. `collection`: All notion collections are stored in this key. A notion collection contains schema of the databases blocks like `collection_view_page` and `collection_view`. Data stored in this map corresponds to `ICollection` interface.
3. `collection_view`: Collection views are views for a particular database. It contains various data required for the view such as the properties to show, the format, sort, filters, aggregations etc. Data stored in this map corresponds to `TView` interface.
4. `space`: A space or workspace contains all your notion data. It contains several pages as its children. Data stored in this map corresponds to `ISpace` interface.
5. `notion_user`: notion_user contains various information regarding the current notion user, like name, email, photo and so on. Data stored in this map corresponds to `INotionUser` interface.
6. `space_view`: A space view contains information regarding a particular space.  Data stored in this map corresponds to `ISpaceView` interface.
7. `user_root`: Honestly not really sure what it does, but data stored in this map corresponds to `IUserRoot` interface.
8. `user_settings`: User settings as the name implies contains settings for the user. Data stored in this map corresponds to `IUserSettings` interface.