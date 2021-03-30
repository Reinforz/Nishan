"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishPackages = void 0;
const child_process_1 = __importDefault(require("child_process"));
const colors_1 = __importDefault(require("colors"));
const path_1 = __importDefault(require("path"));
const __1 = require("../");
async function publishPackages(packages_deps_version_map) {
    const packages_dir = path_1.default.resolve(__dirname, '../../../../packages');
    for (const [scoped_package_name] of Array.from(packages_deps_version_map.entries())) {
        const package_name = scoped_package_name.split('/')[1];
        try {
            await __1.NishanScripts.Update.packageDependency(packages_deps_version_map, scoped_package_name);
            child_process_1.default.execSync(`npm publish --access=public`, { cwd: path_1.default.join(packages_dir, package_name) });
            console.log(colors_1.default.green.bold(`Published ${package_name}`));
        }
        catch (err) {
            console.log(colors_1.default.red.bold(`Error encountered in ${package_name}`));
            console.log(err.stdout.toString());
            process.exit(0);
        }
    }
}
exports.publishPackages = publishPackages;
//# sourceMappingURL=publishPackages.js.map