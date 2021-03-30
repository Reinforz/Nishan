"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPackageMap = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const extractDependencies_1 = require("../Extract/extractDependencies");
async function createPackageMap() {
    const packages_dir = path_1.default.resolve(__dirname, '../../../../packages'), package_dirs = await fs_1.default.promises.readdir(packages_dir), packages_map = new Map();
    for (const package_dir of package_dirs) {
        const package_package_json_data = JSON.parse(await fs_1.default.promises.readFile(path_1.default.join(packages_dir, package_dir, 'package.json'), 'utf-8'));
        packages_map.set(`@nishans/${package_dir}`, {
            dependencies: extractDependencies_1.extractDependencies({ ...(package_package_json_data.dependencies ?? {}), ...(package_package_json_data.devDependencies ?? {}) }),
            version: package_package_json_data.version,
            dependents: {},
            name: `@nishans/${package_dir}`,
            description: package_package_json_data.description,
            published: package_package_json_data.version !== "0.0.0"
        });
    }
    const package_entries = Array.from(packages_map.entries());
    package_entries.forEach(([package_name, package_info]) => {
        const dependencies = Object.keys(package_info.dependencies);
        dependencies.forEach((dependency) => {
            const package_map = packages_map.get(dependency);
            if (package_map)
                package_map.dependents[package_name] = package_info.version;
        });
    });
    return packages_map;
}
exports.createPackageMap = createPackageMap;
//# sourceMappingURL=createPackageMap.js.map