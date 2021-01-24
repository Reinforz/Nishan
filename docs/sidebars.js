module.exports = {
	someSidebar: {
		Introduction: [
			'Introduction/Getting Started',
			'Introduction/Features',
			'Introduction/Understanding Nishan',
			'Introduction/Understanding Notion'
    ],
    "@nishans/types": require("./sidebars/types"),
    "@nishans/core": require("./sidebars/core"),
    "@nishans/utils": require("./sidebars/utils"),
    "@nishans/endpoints": require("./sidebars/endpoints"),
    "@nishans/sync": require("./sidebars/sync"),
    "@nishans/markdown": require("./sidebars/markdown")
	}
};
