/* Connector: registers the Power-Up's capabilities with Trello.
   Runs in a hidden iframe loaded from index.html. */

/* Badge icons must be absolute URLs. Deriving it from the connector's own
   location keeps this working whatever the GitHub username or repo name is. */
var PHONE_ICON = new URL('./icons/phone.svg', window.location.href).href;

function getPhone(t) {
  return t.get('card', 'shared', PHONE_KEY);
}

TrelloPowerUp.initialize({
  /* Front of card, on the board. Display only — badges here are not clickable. */
  'card-badges': function (t) {
    return getPhone(t).then(function (digits) {
      if (!digits) {
        return [];
      }
      return [{
        icon: PHONE_ICON,
        text: formatPhone(digits)
      }];
    });
  },

  /* Card back. This is the edit entry point, since front badges can't be clicked. */
  'card-detail-badges': function (t) {
    return getPhone(t).then(function (digits) {
      return [{
        title: 'Phone',
        text: digits ? formatPhone(digits) : 'Add',
        callback: function (t) {
          return t.popup({
            title: 'Customer Phone',
            url: './edit.html',
            height: 180
          });
        }
      }];
    });
  }
});
