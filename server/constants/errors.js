module.exports.ERRORS = {
  USER: {
    NOT_FOUND_WITH_PROVIDED_INFO:
      'No user found with the provided information.',
    NOT_FOUND: 'No user found.',
    EMAIL_AND_PASSWORD_INCORRECT:
      'Email and password combination is incorrect.',
    ACCOUNT_EMAIL_TAKEN: 'Email address already associated with an account.',
    ACCOUNT_FACEBOOK_TAKEN:
      'Facebook account already associated with an account.',
    ACCOUNT_FACEBOOK_FAILED: 'Facebook account login failed.',
    ACCOUNT_GOOGLE_TAKEN: 'Google account already associated with an account.',
    ACCOUNT_GOOGLE_FAILED: 'Google account login failed.',
    ACCOUNT_NOT_ACTIVATED: 'Your account is not active.',
    PUSH_TOKEN_ALREADY_EXISTS: 'Push token already exists.',
    CONFIRM_TOKEN_NOT_FOUND: 'Confirm token not found.',
  },
  AUTH: {
    DENIED: 'Access denied',
  },
  PRODUCT: {
    SEARCH_TEXT_LENGTH_TOO_SHORT:
      'The search text must be at least 3 characters long',
  },
};
