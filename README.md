# Customer Details — Trello Power-Up

Adds three validated customer fields to Trello cards: **first name**, **surname** and **phone number**.

| Field | Rule |
| --- | --- |
| First name | Letters only, 1–50 characters |
| Surname | Letters only, 1–50 characters |
| Phone | Exactly 10 digits |

- All three are edited in **one popup**, opened from the card back. Validation runs there, so an invalid value is never stored.
- Values appear as **badges on the card front**, so you can scan names and numbers from the board.
- Phone input is forgiving about formatting: `(210) 555-1234`, `210 555 1234` and `2105551234` are all accepted. All three store as `2105551234` and display as `210-555-1234`.
- Names accept **letters in any alphabet**, so Greek and Latin both work (`Μυρσινιάς`, `O'Brien`). Hyphens, apostrophes and internal spaces are allowed; digits and symbols are not. Surrounding whitespace is trimmed and runs of spaces collapsed.
- Leaving a field empty clears it. Fields are independent — you can fill in a name with no phone, or vice versa.
- Saving is **all-or-nothing**: if any filled-in field fails validation, nothing is written, so a card can't end up with half its details saved.

No build step and no dependencies — these are plain static files.

## Why this isn't a Trello Custom Field

Trello's built-in Custom Fields are a closed set of types (text, number, date, dropdown, checkbox). There is no API for a Power-Up to register a new validated type into that UI, so this Power-Up owns its fields and stores them in Power-Up card data (`shared` scope, visible to all board members) under the keys `customerFirstName`, `customerLastName` and `customerPhone`.

The trade-off: these values **will not** appear in Trello's Custom Fields filters, board exports, or the Custom Fields REST endpoints. They are readable through the Power-Up data API and the card's `pluginData`.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Iframe connector Trello loads. Registers the capabilities. |
| `js/client.js` | The `card-badges` and `card-detail-badges` handlers. |
| `edit.html` / `js/edit.js` | The popup form and its validation. |
| `js/fields.js` | Shared normalize/validate/format helpers for all three fields. |
| `icons/` | Badge icons (`person.svg`, `phone.svg`). |

Adding a fourth field means adding one entry to the `FIELDS` array in `js/edit.js` (key, input, error element, normalize, isValid, display) plus its markup — the submit handler is field-agnostic.

## Deploy to GitHub Pages

Pages on a private repo requires a paid plan, so the repo needs to be **public**.

```bash
git init
git add .
git commit -m "Customer Phone Power-Up"
git branch -M main
git remote add origin https://github.com/<your-username>/TrelloPowerUp.git
git push -u origin main
```

Then *Settings → Pages* → source `main` / root. Your connector URL is:

```
https://<your-username>.github.io/TrelloPowerUp/
```

Give Pages a minute to publish, and confirm that URL loads before moving on.

## Register the Power-Up

1. Go to <https://trello.com/apps/admin> → **New**.
2. Pick your workspace, name it (e.g. *Customer Phone*), and set the **Iframe connector URL** to the Pages URL above.
3. On the Power-Up's **Capabilities** tab, enable `card-badges` and `card-detail-badges`. Both the admin toggle *and* the `initialize()` registration in `js/client.js` are required — code alone is not enough on current Trello.
4. On your board: **Power-Ups → Custom** tab → add it.

**Ignore the API Key tab.** It asks for an OAuth 2.0 *Callback URL* and marks it required, but that whole section belongs to Trello's REST API. This Power-Up only uses the iframe client library (`t.get` / `t.set`), which needs no API key, no secret and no OAuth. You would only need it if the Power-Up called the REST API on your behalf via `t.getRestApi()`, which it does not.

## Using it

Open a card. On the card back there are two badges, **Customer** and **Phone**, both reading *Add* until something is stored. Clicking either opens the same popup with all three fields. Fill in what you need and Save — the card-back badges and the card-front badges both update. **Clear all** wipes all three fields at once.

## Local development

Trello accepts `http://localhost:<port>` as a connector URL, so you can register a second, dev-only Power-Up pointing at a local server and skip the push-and-wait cycle.

Node isn't required. Either:

- `python -m http.server 8080` (if Python is installed), or
- the VS Code **Live Server** extension.

Then set the dev Power-Up's connector URL to `http://localhost:8080/`.

Trello caches the connector aggressively — hard-reload the Trello tab (Ctrl+Shift+R) after each change.
