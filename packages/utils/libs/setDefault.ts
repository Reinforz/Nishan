function isObject (item: any) {
	return item && typeof item === 'object' && !Array.isArray(item);
}

export function setDefault (target: Record<string, any>, source: Record<string, any>) {
	Object.keys(source).forEach((key) => {
		if (isObject(source[key])) target[key] = setDefault(target[key] ?? {}, source[key]);
		else if (!(key in target)) Object.assign(target, { [key]: source[key] });
	});
	return target;
}
