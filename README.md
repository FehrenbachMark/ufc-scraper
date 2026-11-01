# UFC Champions

Shows the current UFC champions and the next UFC event's full fight card, scraped from ufc.com. Built with Next.js, React, Motion, and Tailwind.

## Usage

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
npm test        # parser tests (no network)
```

## How it works

- `lib/ufc/selectors.js`: every CSS selector used against ufc.com, with what each one returns. Start here when the site's markup changes.
- `lib/ufc/champions.js`, `lib/ufc/events.js`: pure HTML → data parsers (tested in `test/` against trimmed fixtures).
- `lib/data.js`: `getChampions()` and `getNextEvent()`, cached with Next's `'use cache'`. Champions refresh daily and the next event hourly; `getEventResults()` refreshes the next event's results (from the JSON feed ufc.com's event page uses for its WIN badges) every 5 minutes. A failed refresh keeps serving the last good data.
- Pages: `app/page.jsx` (champions, `/`), `app/next-event/page.jsx` (`/next-event`) and `app/fighter/[slug]/page.jsx` (`/fighter/joshua-van`: profile + last 5 fights, cached daily per fighter). `components/` holds the UI, built on the shared `Panel`.

All the ufc.com pages used (`/athletes`, `/events`, `/event/<slug>`) are server-rendered, so a plain `fetch` + cheerio is enough; no headless browser.

## License

[MIT](https://github.com/FehrenbachMark/ufc-scraper/blob/main/license.txt)

Content is property of UFC, for educational purposes only.

## Author

**Mark Fehrenbach**

- [github/](https://github.com/fehrenbachmark)
- [twitter/](http://twitter.com/fehrenbachmark)
