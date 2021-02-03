export type TDateType = 'date' | 'datetimerange' | 'datetime' | 'daterange';
export type TDateFormat = 'YYYY/MM/DD' | 'll' | 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'relative';
export type TTimeFormat = 'H:mm' | 'LT';
export type TDateReminderUnit = 'day' | 'hour' | 'minute';

export interface IDateReminder {
	time?: string;
	unit: TDateReminderUnit;
	value: number;
}

export interface Date {
	date_format: TDateFormat;
	type: TDateType;
	start_date: string;
	time_format?: TTimeFormat;
	reminder?: IDateReminder;
}

export interface IDate extends Date {
	type: 'date';
}

export interface IDateTime extends Date {
	type: 'datetime';
	start_time: string;
	time_zone: string;
}

export interface IDateTimeRange extends Date {
	type: 'datetimerange';
	end_date: string;
	start_time: string;
	end_time: string;
	time_zone: string;
}

export interface IDateRange extends Date {
	type: 'daterange';
	end_date: string;
}

export type InlineDate = IDate | IDateTime | IDateTimeRange | IDateRange;
