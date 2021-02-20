export function isObject (item: any) {
	return item && typeof item === 'object' && !Array.isArray(item);
}

export function deepMerge (target: any, source: any) {
	if (isObject(target) && isObject(source)) {
		Object.keys(source).forEach((key) => {
			if (isObject(source[key])) {
				if (!(key in target)) Object.assign(target, { [key]: source[key] });
				else target[key] = deepMerge(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		});
	}
	return target;
}
