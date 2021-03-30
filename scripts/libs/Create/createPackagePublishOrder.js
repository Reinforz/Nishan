"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPackagePublishOrder = void 0;
function createPackagePublishOrder(updated_packages, packages_map) {
    const package_publish_order = updated_packages
        .sort((updated_package_a, updated_package_b) => {
        const package_a_map = packages_map.get(updated_package_a), package_b_map = packages_map.get(updated_package_b);
        if (package_a_map.dependents[`${updated_package_b}`])
            return 1;
        else if (package_b_map.dependents[`${updated_package_a}`])
            return -1;
        else
            return 0;
    })
        .reduce((arr, rearranged_package) => [...arr, rearranged_package], [])
        .reverse();
    return package_publish_order;
}
exports.createPackagePublishOrder = createPackagePublishOrder;
//# sourceMappingURL=createPackagePublishOrder.js.map