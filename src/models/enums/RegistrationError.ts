export enum RegistrationError {
  // Firebase Auth Errors https://firebase.google.com/docs/reference/js/auth#autherrorcodes
  CREDENTIAL_ALREADY_IN_USE = 'auth/credential-already-in-use',
  EMAIL_EXISTS = 'auth/email-already-in-use',
  INTERNAL_ERROR = 'auth/internal-error',
  INVALID_EMAIL = 'auth/invalid-email',
  INVALID_PASSWORD = 'auth/invalid-password',
  NETWORK_REQUEST_FAILED = 'auth/network-request-failed',
  TIMEOUT = 'auth/timeout',
  TOO_MANY_ATTEMPTS_TRY_LATER = 'auth/too-many-requests',
  WEAK_PASSWORD = 'auth/weak-password',
  USER_CANCELLED = 'auth/user-cancelled',
  USER_DELETED = 'auth/user-deleted',
  USER_DISABLED = 'auth/user-disabled',
  // Local errors
  TYPED_INCORRECT_EMAIL = 'typed-incorrect-email',
  TYPED_INCORRECT_PASSWORD = 'typed-incorrect-password',
  ERROR_WHILE_SENDING_VERIFICATION_EMAIL = 'error-while-sending-verification-email',
  INTERNAL_AUTH_ERROR = 'internal-error',
  PASSWORDS_DO_NOT_MATCH = 'passwords-do-not-match',
}
