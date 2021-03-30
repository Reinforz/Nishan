"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageJsonData = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getPackageJsonData = async (package_name) => {
    const packages_dir = path_1.default.resolve(__dirname, '../../../../packages');
    const package_dir = path_1.default.join(packages_dir, package_name.split('/')[1]), package_package_json_path = path_1.default.join(package_dir, 'package.json');
    return {
        package_json_data: JSON.parse(await fs_1.default.promises.readFile(package_package_json_path, 'utf-8')),
        package_json_path: package_package_json_path
    };
};
exports.getPackageJsonData = getPackageJsonData;
//# sourceMappingURL=getPackageJsonData.js.map