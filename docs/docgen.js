const TypeDoc = require('typedoc');
const path = require('path');
const fs = require('fs');

async function generate (package_name) {
	const app = new TypeDoc.Application();
	app.options.addReader(new TypeDoc.TSConfigReader());
	app.bootstrap({
		entryPoints: [ path.resolve(__dirname, `../packages/${package_name}/src/index.ts`) ],
		excludeExternals: true,
    excludePrivate: true,
    categorizeByGroup: true,
    excludeProtected: true,
    readme: `../packages/${package_name}/README.md`,
    plugin: ['typedoc-plugin-markdown' ]
	});

	const project = app.convert();

  if (project) await app.generateDocs(project, `docs/${package_name}`);
  const sidebar = await generateSidebar(`docs/${package_name}`);
  await fs.promises.writeFile(`sidebars/${package_name}.js`, `module.exports = ${JSON.stringify(sidebar)}`)
}

async function generateSidebar(rootpath){
  const sidebar = [];
  async function inner(filepath, parent){
    const files = await fs.promises.readdir(filepath);
    for (let index = 0; index < files.length; index++) {
      const new_path = path.join(filepath, files[index]);
      const stat = await fs.promises.lstat(new_path);
      if(stat.isDirectory()){
        const category = {
          type: "category",
          label: path.basename(files[index]),
          items: []
        }
        parent.push(category)
        await inner(new_path,category.items)
      }
      else
        parent.push(new_path.replace(/\\/g, '/').split("/").slice(1).join("/").split(".")[0])
    }
  }
  await inner(rootpath, sidebar);
  return sidebar;
}

async function main(){
  const package_names = ['sync'];
  for (let index = 0; index < package_names.length; index++) {
    await generate(package_names[index])
  }
}

main()