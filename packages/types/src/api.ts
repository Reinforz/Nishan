export type TNotionApiError = TNotionApiUserValidationError;

export type TNotionApiErrorName =
	| 'UserValidationError'
	| 'UnauthorizedError'
	| 'UserRateLimitResponse'
	| 'ValidationError'
	| 'PostgresNullConstraintError';
export interface INotionApiError {
	errorId: string;
	name: TNotionApiErrorName;
	message: string;
}

export type TNotionApiUserValidationError =
	| NotionApiUserValidationPasswordNotEnteredError
	| NotionApiUserValidationIncorrectPasswordError;

export interface NotionApiUserValidationPasswordNotEnteredError extends INotionApiError {
	message: 'Please enter your password.';
	name: 'UserValidationError';
	clientData: { type: 'password_not_entered' };
}

export interface NotionApiUserValidationIncorrectPasswordError extends INotionApiError {
	message: 'Incorrect password.';
	name: 'UserValidationError';
	clientData: { type: 'incorrect_password' };
}

export interface NotionApiUnauthorizedError extends INotionApiError {
	message: 'Must be authenticated.';
	name: 'UnauthorizedError';
}

export interface NotionApiUserRateLimitResponseError extends INotionApiError {
	message: 'Please try again later.';
	name: 'UserRateLimitResponse';
	clientData: { type: 'rate_limited' };
}

export interface NotionApiValidationError extends INotionApiError {
	message: 'Unsaved transactions.';
	name: 'ValidationError';
	clientData: {
		type: 'unsaved_transactions';
		errors: [
			{
				id: string;
				name: 'ValidationError';
				retryable: boolean;
			}
		];
		untried: string[];
	};
}
export interface NotionApiInvalidInputError extends INotionApiError {
	message: 'Invalid input.';
	name: 'ValidationError';
}

export interface NotionApiPostgresNullConstraintError extends INotionApiError {
	name: 'PostgresNullConstraintError';
	message: 'Unsaved transactions.';
	clientData: {
		type: 'unsaved_transactions';
		errors: [
			{
				id: string;
				name: 'PostgresNullConstraintError';
				retryable: boolean;
			}
		];
		untried: [];
	};
}
