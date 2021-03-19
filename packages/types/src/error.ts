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
	| NotionApiUserValidationIncorrectPasswordError
	| NotionApiUserValidationInvalidOrExpiredPasswordError
	| NotionApiUserValidationUserWithEmailExistsError;

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

export interface NotionApiUserValidationInvalidOrExpiredPasswordError extends INotionApiError {
	message: 'Invalid or expired password.';
	name: 'UserValidationError';
	clientData: { type: 'invalid_or_expired_password' };
}

export interface NotionApiUserValidationUserWithEmailExistsError extends INotionApiError {
	message: 'A user with this email already exists.';
	name: 'UserValidationError';
	clientData: { type: 'user_with_email_already_exists' };
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

export interface NotionApiUnsavedTransactionError extends INotionApiError {
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

export interface NotionApiMissingTokenError extends INotionApiError {
	message: string;
	name: 'ValidationError';
}

export type TNotionApiValidatorError =
	| NotionApiMissingTokenError
	| NotionApiInvalidInputError
	| NotionApiUnsavedTransactionError;

export type TNotionApiError =
	| NotionApiUserRateLimitResponseError
	| NotionApiUnauthorizedError
	| TNotionApiValidatorError
	| TNotionApiUserValidationError
	| NotionApiPostgresNullConstraintError;
