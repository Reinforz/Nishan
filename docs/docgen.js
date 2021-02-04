const TypeDoc = require('typedoc');
const path = require('path');
const fs = require('fs');
const colors = require('colors');

async function generate (package_name) {
	const app = new TypeDoc.Application();
  app.options.addReader(new TypeDoc.TSConfigReader());
  const package_dir = path.resolve(__dirname, `../packages/${package_name}`)
	app.bootstrap({
		entryPoints: [ path.join(package_dir, 'src', 'index.ts') ],
		excludeExternals: true,
    excludePrivate: false,
    categorizeByGroup: true,
    excludeProtected: false,
    readme: path.join(package_dir, "README.md"),
    plugin: ['typedoc-plugin-markdown' ]
	});

	const project = app.convert();
  const api_dir = `docs/${package_name}/api`
  if (project) await app.generateDocs(project, api_dir);
  const sidebar = await generateSidebar(api_dir);
  await fs.promises.writeFile(`sidebars/${package_name}.json`, `${JSON.stringify(sidebar, null, 2)}`)
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

const package_names = ['types','endpoints','core','markdown','sync','utils', 'notion-formula'];

async function main(){
  for (let index = 0; index < package_names.length; index++) {
    await generate(package_names[index])
    console.log(`Done with ${colors.red.bold(package_names[index])}`);
  }
}

main()