module.exports = {
	docs: {
		Introduction: [
			'Introduction/Getting Started',
			'Introduction/Features',
			'Introduction/Understanding Nishan',
			'Introduction/Understanding Notion'
    ]
	},
  "types": require("./sidebars/types"),
  "endpoints": require("./sidebars/endpoints"),
  "core": require("./sidebars/core"),
  "notion-formula": {
    API: require("./sidebars/notion-formula"),
    docs: [
      {
        type: "category",
        label: "Introduction",
        items: ["Introduction/Introduction", "Introduction/Getting Started", "Introduction/Features",  "Introduction/Typescript Support"]
      },
      {
        type: "category",
        label: "Theory",
        items: ["Theory/Notion Formula", "Theory/Schema Map"]
      },
      {
        type: "category",
        label: "Reference",
        items: ["Reference/Notion Functions"]
      },
      {
        type: "category",
        label: "Usage",
        items: ["Usage/Object Representation", "Usage/Array Representation", "Usage/String Representation", "Usage/Integration"]
      },
      {
        type: "category",
        label: "Parsing",
        items: ["Parsing/Errors"]
      }
    ]
  },
  "utils": {
    docs: [
      {
        type: "category",
        label: "Introduction",
        items: ["Introduction/Introduction", "Introduction/Getting Started", "Introduction/Features"]
      },
      {
        type: "category",
        label: "Modules",
        items: ["Modules/InlineBlocks", "Modules/uuidConversion", "Modules/generateSchemaMap"]
      },
    ],
    api: require("./sidebars/utils")
  },
  // "sync": require("./sidebars/sync"),
  // "markdown": require("./sidebars/markdown")
};
