export type INotionRepositionParams =
	| {
			id: string;
			position: 'Before' | 'After';
		}
	| number
	| undefined;
