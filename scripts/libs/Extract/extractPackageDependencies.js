"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageDependencies = void 0;
const colors_1 = __importDefault(require("colors"));
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
const extractModuleDependencies_1 = require("./extractModuleDependencies");
const extractPackageDependencies = async (package_name) => {
    const imported_package_dependencies_map = new Map();
    const package_src_dir = path_1.default.resolve(__dirname, `../../../../packages/${package_name}/libs`);
    return new Promise((resolve) => {
        glob_1.default(`${package_src_dir}/**/*.ts`, {}, (_, files) => {
            files.forEach((file) => {
                const imported_module_dependencies = extractModuleDependencies_1.extractModuleDependencies(file);
                const dir_name = path_1.default.relative(package_src_dir, file);
                imported_module_dependencies.forEach((imported_module_dependency) => {
                    const imported_package_dependency_map = imported_package_dependencies_map.get(imported_module_dependency);
                    if (imported_package_dependency_map)
                        imported_package_dependency_map.push(dir_name);
                    else
                        imported_package_dependencies_map.set(imported_module_dependency, [dir_name]);
                });
                console.log(colors_1.default.green.bold(`Extracted module ${dir_name}`));
            });
            resolve(imported_package_dependencies_map);
        });
    });
};
exports.extractPackageDependencies = extractPackageDependencies;
//# sourceMappingURL=extractPackageDependencies.js.map