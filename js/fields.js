/* Shared field helpers for the Customer Details Power-Up.
   Loaded by both the connector (client.js) and the popup (edit.js). */

var FIRST_NAME_KEY = 'customerFirstName';
var LAST_NAME_KEY = 'customerLastName';
var PHONE_KEY = 'customerPhone';

var NAME_MAX = 50;

/* ---------- phone ---------- */

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

/* ---------- names ---------- */

/* Trim, and collapse runs of whitespace so "  Άννα   Μαρία " -> "Άννα Μαρία". */
function normalizeName(input) {
  return String(input == null ? '' : input).trim().replace(/\s+/g, ' ');
}

/* Letters from ANY alphabet (\p{L}), so Greek and Latin names both pass —
   restricting to A-Z would reject Παπαδόπουλος. \p{M} allows combining
   accents. Hyphen, apostrophe and space are permitted inside the name
   (Mary-Jane, O'Brien, Van der Berg) but it must start and end with a
   letter, which keeps out " -" and similar. No digits, no symbols. */
/* ’ is the curly apostrophe, escaped rather than written literally so the
   pattern cannot break if this file is ever served with the wrong charset. */
var NAME_PATTERN = /^\p{L}(?:[\p{L}\p{M}'’ -]*\p{L})?$/u;

function isValidName(value) {
  return value.length > 0 && value.length <= NAME_MAX && NAME_PATTERN.test(value);
}

/* "Αντώνης Μυρσινιάς", or just whichever half is filled in. */
function fullName(first, last) {
  return [first, last].filter(Boolean).join(' ');
}
