"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePackageMetadata = void 0;
const colors_1 = __importDefault(require("colors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const remark_1 = __importDefault(require("remark"));
const ts_dedent_1 = __importDefault(require("ts-dedent"));
const packages_json_1 = __importDefault(require("../../packages.json"));
const createReadme_1 = require("../Create/createReadme");
const updatePackageDescription_1 = require("./updatePackageDescription");
async function updatePackageMetadata() {
    const docs_dir = path_1.default.resolve(__dirname, '../../../../docs/docs'), packages_dir = path_1.default.resolve(__dirname, '../../../../packages'), root_readme_path = path_1.default.resolve(__dirname, '../../../../README.md'), root_readme_text = await fs_1.default.promises.readFile(root_readme_path, 'utf-8'), parsed_root_readme_md = remark_1.default().parse(root_readme_text);
    let total_published_packages = 0, packages_readme_text = ``;
    const docs_dirs = await fs_1.default.promises.readdir(docs_dir);
    for (let index = 0; index < packages_json_1.default.length; index++) {
        packages_json_1.default[index].name = packages_json_1.default[index].name.split('/')[1];
        const package_data = packages_json_1.default[index], { name } = package_data, package_dir = path_1.default.join(packages_dir, name), package_readme_path = path_1.default.join(package_dir, 'README.md'), package_json_path = path_1.default.join(package_dir, 'package.json');
        await createReadme_1.createReadme(package_readme_path, name, package_data.description);
        await updatePackageDescription_1.updatePackageDescription(package_json_path, package_data.description);
        const github_link = ` [Github](https://github.com/Devorein/Nishan/tree/master/packages/${name})`, doc_link = docs_dirs.includes(name) ? ` [Docs](https://nishan-docs.netlify.app/docs/${name})` : '', npm_link = package_data.published ? ` [NPM](https://www.npmjs.com/package/@nishans/${name})` : '';
        total_published_packages += package_data.published ? 1 : 0;
        packages_readme_text += `* **\`@nishans/${name}\`**${github_link}${doc_link}${npm_link}: ${package_data.description}\n`;
        console.log(colors_1.default.bold.green(`Done with ${name}`));
    }
    const packages_readme_node = remark_1.default().parse(packages_readme_text);
    let target_node_index = 0;
    for (let index = 0; index < parsed_root_readme_md.children.length; index++) {
        const node = parsed_root_readme_md.children[index];
        if (node.type === 'heading' &&
            node.children[0].value === 'Packages' &&
            parsed_root_readme_md.children[index + 1].type === 'list') {
            target_node_index = index + 1;
            break;
        }
    }
    parsed_root_readme_md.children[target_node_index] = packages_readme_node;
    parsed_root_readme_md.children[5] = remark_1.default().parse(ts_dedent_1.default `
  <p align="center">
    <img src="https://img.shields.io/badge/Total%20Packages-${packages_json_1.default.length}-%2371368a">
    <img src="https://img.shields.io/badge/Published%20Packages-${total_published_packages}-%2311806a">
  </p>`);
    await fs_1.default.promises.writeFile(root_readme_path, remark_1.default().stringify(parsed_root_readme_md), 'utf-8');
}
exports.updatePackageMetadata = updatePackageMetadata;
//# sourceMappingURL=updatePackageMetadata.js.map