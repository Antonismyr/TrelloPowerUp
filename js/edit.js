/* Popup form. This is the only place customer details can be written,
   so every validation rule is enforced here before anything is stored. */

var t = TrelloPowerUp.iframe();

var form = document.getElementById('details-form');
var clearLink = document.getElementById('clear-all');

/* Each field pairs a storage key with its own normalize/validate rules, so
   the submit handler below stays the same no matter how many fields exist. */
var FIELDS = [
  {
    key: FIRST_NAME_KEY,
    input: document.getElementById('first-name'),
    error: document.getElementById('first-name-error'),
    normalize: normalizeName,
    isValid: isValidName,
    display: function (v) { return v; }
  },
  {
    key: LAST_NAME_KEY,
    input: document.getElementById('last-name'),
    error: document.getElementById('last-name-error'),
    normalize: normalizeName,
    isValid: isValidName,
    display: function (v) { return v; }
  },
  {
    key: PHONE_KEY,
    input: document.getElementById('phone'),
    error: document.getElementById('phone-error'),
    normalize: normalizePhone,
    isValid: isValidPhone,
    display: formatPhone
  }
];

function showError(field, show) {
  field.error.hidden = !show;
  field.input.classList.toggle('error', show);
}

/* Prefill from storage, and only offer "Clear all" when there is something
   to clear. */
Promise.all(FIELDS.map(function (field) {
  return t.get('card', 'shared', field.key);
})).then(function (values) {
  var anySet = false;

  values.forEach(function (value, i) {
    if (value) {
      FIELDS[i].input.value = FIELDS[i].display(value);
      anySet = true;
    }
  });

  clearLink.hidden = !anySet;
  FIELDS[0].input.focus();
  return t.sizeTo(document.body);
});

/* Clear a stale error as soon as the field becomes acceptable again. */
FIELDS.forEach(function (field) {
  field.input.addEventListener('input', function () {
    var value = field.normalize(field.input.value);
    if (!field.error.hidden && (value === '' || field.isValid(value))) {
      showError(field, false);
    }
  });
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  var toSet = {};
  var toRemove = [];
  var firstBad = null;

  FIELDS.forEach(function (field) {
    var value = field.normalize(field.input.value);

    if (value === '') {
      /* An empty field means "clear this one", not "invalid". */
      showError(field, false);
      toRemove.push(field.key);
      return;
    }

    if (!field.isValid(value)) {
      showError(field, true);
      firstBad = firstBad || field;
      return;
    }

    showError(field, false);
    toSet[field.key] = value;
  });

  /* Nothing is written unless every filled-in field passes, so a card can
     never end up with half its details saved. */
  if (firstBad) {
    firstBad.input.focus();
    firstBad.input.select();
    return t.sizeTo(document.body);
  }

  var ops = [];
  if (Object.keys(toSet).length) {
    ops.push(t.set('card', 'shared', toSet));
  }
  if (toRemove.length) {
    ops.push(t.remove('card', 'shared', toRemove));
  }

  return Promise.all(ops).then(function () {
    return t.closePopup();
  });
});

clearLink.addEventListener('click', function (e) {
  e.preventDefault();

  var keys = FIELDS.map(function (field) { return field.key; });

  return t.remove('card', 'shared', keys).then(function () {
    return t.closePopup();
  });
});
