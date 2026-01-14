/**
 * Validation Utilities
 * Helper functions for validating user input
 * @module utils/validation
 */

/**
 * Validates email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateEmail = (email) => {
  // Standard email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password (simple check - can be enhanced)
 * @param {string} password - Password to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validatePassword = (password) => {
  // Minimum 6 characters (not too restrictive for fantasy app)
  return password && password.length >= 6;
};

/**
 * Checks if form is valid
 * @param {string} email - Email address
 * @param {string} password - Password
 * @returns {boolean} - True if both fields are valid
 */
export const validateForm = (email, password) => {
  return validateEmail(email) && validatePassword(password);
};
