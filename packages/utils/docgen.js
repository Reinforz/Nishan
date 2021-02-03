const TypeDoc = require('typedoc');
const path = require('path');

async function generate () {
	const app = new TypeDoc.Application();
	app.options.addReader(new TypeDoc.TSConfigReader());
	app.bootstrap({
		entryPoints: [ path.resolve(__dirname, `./src/index.ts`) ],
		excludeExternals: true,
    excludePrivate: true,
    excludeProtected: true,
    readme: `./src/README.md`,
    plugin: ['typedoc-plugin-markdown' ]
	});

	const project = app.convert();

  if (project) await app.generateDocs(project, `api`);
}

generate()