/* Shared helpers for the Customer Phone Power-Up.
   Loaded by both the connector (client.js) and the popup (edit.js). */

var PHONE_KEY = 'customerPhone';

/* Strip everything that is not a digit, so "(210) 555-1234" and
   "210 555 1234" both reduce to "2105551234". */
function normalizePhone(input) {
  return String(input == null ? '' : input).replace(/\D/g, '');
}

function isValidPhone(digits) {
  return /^\d{10}$/.test(digits);
}

/* 2105551234 -> 210-555-1234. Anything not exactly 10 digits is
   returned untouched rather than half-formatted. */
function formatPhone(digits) {
  if (!isValidPhone(digits)) {
    return String(digits == null ? '' : digits);
  }
  return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
}
