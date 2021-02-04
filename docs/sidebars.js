module.exports = {
	root: {
		Introduction: [
			'root/Introduction/Getting Started',
			'root/Introduction/Features',
			'root/Introduction/Understanding Nishan',
			'root/Introduction/Understanding Notion'
    ]
	},
  "types": {
    API: require("./sidebars/types")
  },
  "endpoints": {
    API: require("./sidebars/endpoints")
  },
  "core": {
    API: require("./sidebars/core")
  },
  "notion-formula": {
    Introduction: ["notion-formula/Introduction/Introduction", "notion-formula/Introduction/Getting Started", "notion-formula/Introduction/Features",  "notion-formula/Introduction/Typescript Support"],
    Theory: ["notion-formula/Theory/Notion Formula", "notion-formula/Theory/Schema Map"],
    Reference: ["notion-formula/Reference/Notion Functions"],
    Usage: ["notion-formula/Usage/Object Representation", "notion-formula/Usage/Array Representation", "notion-formula/Usage/String Representation", "notion-formula/Usage/Integration"],
    Parsing: ["notion-formula/Parsing/Errors"],
    API: require("./sidebars/notion-formula"),
  },
  "utils": {
    API: require("./sidebars/utils"),
    Introduction: ["utils/Introduction/Introduction", "utils/Introduction/Getting Started", "utils/Introduction/Features"],
    Modules: ["utils/Modules/InlineBlocks", "utils/Modules/uuidConversion", "utils/Modules/generateSchemaMap"],
  },
  "sync": {
    API: require("./sidebars/sync")
  },
  "markdown": {
    API: require("./sidebars/markdown")
  }
};
