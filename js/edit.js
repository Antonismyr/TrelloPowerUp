/* Popup form. This is the only place a phone number can be written,
   so the 10-digit rule is enforced here before anything is stored. */

var t = TrelloPowerUp.iframe();

var form = document.getElementById('phone-form');
var input = document.getElementById('phone');
var error = document.getElementById('error');
var removeLink = document.getElementById('remove');

function showError(show) {
  error.hidden = !show;
  input.classList.toggle('error', show);
}

/* Prefill with whatever is already stored, and only offer Remove if
   there is something to remove. */
t.get('card', 'shared', PHONE_KEY).then(function (digits) {
  if (digits) {
    input.value = formatPhone(digits);
    removeLink.hidden = false;
  }
  input.focus();
  return t.sizeTo(document.body);
});

/* Clear a stale error as soon as the input becomes valid again. */
input.addEventListener('input', function () {
  if (!error.hidden && isValidPhone(normalizePhone(input.value))) {
    showError(false);
  }
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  var digits = normalizePhone(input.value);

  if (!isValidPhone(digits)) {
    showError(true);
    input.focus();
    input.select();
    return t.sizeTo(document.body);
  }

  return t.set('card', 'shared', PHONE_KEY, digits).then(function () {
    return t.closePopup();
  });
});

removeLink.addEventListener('click', function (e) {
  e.preventDefault();
  return t.remove('card', 'shared', PHONE_KEY).then(function () {
    return t.closePopup();
  });
});
