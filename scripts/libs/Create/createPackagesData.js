"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPackagesData = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const createPackageMap_1 = require("./createPackageMap");
async function createPackagesData() {
    const packages_data_json_path = path_1.default.resolve(__dirname, '../../../packages.json');
    const package_map = await createPackageMap_1.createPackageMap();
    const packages_data = [];
    for (const [, package_data] of package_map) {
        packages_data.push({
            name: package_data.name,
            description: package_data.description,
            published: package_data.published
        });
    }
    await fs_1.default.promises.writeFile(packages_data_json_path, JSON.stringify(packages_data, null, 2), 'utf-8');
}
exports.createPackagesData = createPackagesData;
//# sourceMappingURL=createPackagesData.js.map