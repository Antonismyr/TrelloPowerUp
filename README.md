# Customer Phone — Trello Power-Up

Adds a customer phone number to Trello cards that accepts **only a 10-digit number**.

- Shows the number as a **badge on the card front**, so you can scan numbers from the board.
- Edited through a popup on the card back, where the 10-digit rule is enforced. An invalid number is never stored.
- Input is forgiving about formatting: `(210) 555-1234`, `210 555 1234` and `2105551234` are all accepted. All three store as `2105551234` and display as `210-555-1234`.

No build step and no dependencies — these are plain static files.

## Why this isn't a Trello Custom Field

Trello's built-in Custom Fields are a closed set of types (text, number, date, dropdown, checkbox). There is no API for a Power-Up to register a new validated "phone" type into that UI, so this Power-Up owns its own field and stores the value in Power-Up card data (`shared` scope, visible to all board members).

The trade-off: the number **will not** appear in Trello's Custom Fields filters, board exports, or the Custom Fields REST endpoints. It is readable through the Power-Up data API and the card's `pluginData`.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Iframe connector Trello loads. Registers the capabilities. |
| `js/client.js` | The `card-badges` and `card-detail-badges` handlers. |
| `edit.html` / `js/edit.js` | The popup form and its validation. |
| `js/phone.js` | Shared `normalizePhone` / `isValidPhone` / `formatPhone` helpers. |
| `icons/phone.svg` | Badge icon. |

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

1. Go to <https://trello.com/power-ups/admin> → **New**.
2. Pick your workspace, name it (e.g. *Customer Phone*), and set the **Iframe connector URL** to the Pages URL above.
3. On the Power-Up's **Capabilities** tab, enable `card-badges` and `card-detail-badges`. Both the admin toggle *and* the `initialize()` registration in `js/client.js` are required — code alone is not enough on current Trello.
4. On your board: **Power-Ups → Custom** tab → add it.

## Using it

Open a card. On the card back there is a **Phone** badge reading *Add*. Click it, type the number, Save. The badge and the card-front badge both update. Reopen the popup to change it, or click **Remove** to clear it.

## Local development

Trello accepts `http://localhost:<port>` as a connector URL, so you can register a second, dev-only Power-Up pointing at a local server and skip the push-and-wait cycle.

Node isn't required. Either:

- `python -m http.server 8080` (if Python is installed), or
- the VS Code **Live Server** extension.

Then set the dev Power-Up's connector URL to `http://localhost:8080/`.

Trello caches the connector aggressively — hard-reload the Trello tab (Ctrl+Shift+R) after each change.
