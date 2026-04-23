/**
 * Utility to handle phone number formatting and conversion
 */

/**
 * Converts a phone number string to a BigInt after removing all non-numeric characters.
 * If the number is 10 digits, it prepends 91 (default country code) before converting.
 */
export const parsePhoneNumber = (phone) => {
  if (!phone) return null;
  
  // Remove all non-numeric characters (handles spaces, +, -, etc.)
  const numeric = phone.toString().replace(/\D/g, '');
  
  if (!numeric) return null;

  // If 10 digits, assume India (+91)
  if (numeric.length === 10) {
    return BigInt('91' + numeric);
  }

  // Otherwise return as is (assuming it already has country code)
  return BigInt(numeric);
};

/**
 * Formats a BigInt phone number back to a string with a '+' prefix
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  return '+' + phone.toString();
};
