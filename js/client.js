/* Connector: registers the Power-Up's capabilities with Trello.
   Runs in a hidden iframe loaded from index.html. */

/* Badge icons must be absolute URLs. Deriving them from the connector's own
   location keeps this working whatever the GitHub username or repo name is. */
var PHONE_ICON = new URL('./icons/phone.svg', window.location.href).href;
var PERSON_ICON = new URL('./icons/person.svg', window.location.href).href;

function getFields(t) {
  return Promise.all([
    t.get('card', 'shared', FIRST_NAME_KEY),
    t.get('card', 'shared', LAST_NAME_KEY),
    t.get('card', 'shared', PHONE_KEY)
  ]).then(function (values) {
    return {
      first: values[0] || '',
      last: values[1] || '',
      phone: values[2] || ''
    };
  });
}

/* All three fields are edited in one popup, so every badge opens the same form. */
function openEditor(t) {
  return t.popup({
    title: 'Customer Details',
    url: './edit.html',
    height: 360
  });
}

TrelloPowerUp.initialize({
  /* Front of card, on the board. Display only — badges here are not clickable. */
  'card-badges': function (t) {
    return getFields(t).then(function (f) {
      var badges = [];
      var name = fullName(f.first, f.last);

      if (name) {
        badges.push({ icon: PERSON_ICON, text: name });
      }
      if (f.phone) {
        badges.push({ icon: PHONE_ICON, text: formatPhone(f.phone) });
      }
      return badges;
    });
  },

  /* Card back. These are the edit entry points, since front badges can't be clicked. */
  'card-detail-badges': function (t) {
    return getFields(t).then(function (f) {
      var name = fullName(f.first, f.last);

      return [
        {
          title: 'Customer',
          text: name || 'Add',
          callback: openEditor
        },
        {
          title: 'Phone',
          text: f.phone ? formatPhone(f.phone) : 'Add',
          callback: openEditor
        }
      ];
    });
  }
});
