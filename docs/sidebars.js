module.exports = {
	/* docs: {
		Introduction: [
			'root/Introduction/Getting Started',
			'root/Introduction/Features',
			'root/Introduction/Understanding Nishan',
			'root/Introduction/Understanding Notion'
    ]
	},
  "types": {
    api: require("./sidebars/types")
  },
  "endpoints": {
    api: require("./sidebars/endpoints")
  },
  "core": {
    api: require("./sidebars/core")
  }, */
  "notion-formula": {
    api: require("./sidebars/notion-formula"),
    docs: [
      {
        Introduction: ["notion-formula/Introduction/Introduction", "notion-formula/Introduction/Getting Started", "notion-formula/Introduction/Features",  "notion-formula/Introduction/Typescript Support"]
      },
      {
        Theory: ["notion-formula/Theory/Notion Formula", "notion-formula/Theory/Schema Map"]
      },
      {
        Reference: ["notion-formula/Reference/Notion Functions"]
      },
      {
        Usage: ["notion-formula/Usage/Object Representation", "notion-formula/Usage/Array Representation", "notion-formula/Usage/String Representation", "notion-formula/Usage/Integration"]
      },
      {
        Parsing: ["notion-formula/Parsing/Errors"]
      }
    ]
  },
  /* "utils": {
    docs: [
      {
        Introduction: ["utis/Introduction/Introduction", "utis/Introduction/Getting Started", "utis/Introduction/Features"]
      },
      {
        Modules: ["utis/Modules/InlineBlocks", "utis/Modules/uuidConversion", "utis/Modules/generateSchemaMap"]
      },
    ],
    api: require("./sidebars/utils")
  },
  "sync": {
    api: require("./sidebars/sync")
  },
  "markdown": {
    api: require("./sidebars/markdown")
  } */
};
