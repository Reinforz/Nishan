import { IMember, TCredit } from './';

export interface ISubscriptionData {
	accountBalance: number;
	availableCredit: number;
	bots: string[];
	creditEnabled: boolean;
	hasPaidNonzero: boolean;
	isDelinquent: boolean;
	isSubscribed: boolean;
	joinedMemberIds: string[];
	credits: TCredit[];
	members: IMember[];
	spaceUsers: string[];
	timelineViewUsage: number;
	totalCredit: number;
}

export interface UnsubscribedSubscriptionData extends ISubscriptionData {
	blockUsage: number;
	type: 'unsubscribed_admin';
}

export interface SubscribedSubscriptionData extends ISubscriptionData {
	type: 'subscribed_admin';
	customerId: string;
	productId: string;
	billingEmail: string;
	plan: 'student_free';
	planAmount: number;
	accountBalance: number;
	monthlyPlanAmount: number;
	yearlyPlanAmount: number;
	quantity: number;
	billing: 'charge_automatically';
	address: {
		name: string;
		businessName: string;
		addressLine1: string;
		addressLine2: string;
		zipCode: string;
		city: string;
		state: string;
		country: string;
	};
	interval: 'month' | 'year';
	created: number;
	periodEnd: number;
	nextInvoiceTime: number;
	nextInvoiceAmount: number;
	hasPaidNonzero: boolean;
}
