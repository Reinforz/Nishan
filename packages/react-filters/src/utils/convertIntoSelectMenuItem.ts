export function convertIntoSelectMenuItem (
	label: string
): {
	label: string;
	value: any;
} {
	return {
		label,
		value: label.toLowerCase().split(' ').join('_')
	};
}

export function convertIntoSelectMenuItems (labels: string[]) {
	return labels.map(convertIntoSelectMenuItem);
}
