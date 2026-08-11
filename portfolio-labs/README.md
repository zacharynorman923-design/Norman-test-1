# Portfolio Labs

A dependency-free web tool for **analyzing and backtesting an investment
portfolio** — in the spirit of PortfoliosLab. Build a portfolio by allocation,
pull **live market data**, and get real risk/return analytics: growth vs a
benchmark, drawdowns, Sharpe / Sortino / Calmar, VaR / CVaR, correlations,
beta / alpha, and a Monte Carlo projection.

> This app lives entirely inside the `portfolio-labs/` folder and is completely
> separate from the SPLIT app at the repository root. It has its own service
> worker (scoped to this folder), manifest, and assets — nothing here touches
> SPLIT, and the two can be deployed side by side.

## Live at

- Root SPLIT app: `https://<user>.github.io/<repo>/`
- **Portfolio Labs:** `https://<user>.github.io/<repo>/portfolio-labs/`

## Live market data (bring your own key)

This is a **static site** — there is no Portfolio Labs backend. Price data is
fetched **directly from your browser** to a market-data provider, using a free
API key that is stored only in your browser's `localStorage`. Two providers are
supported (open **⚙ Data source** in the app):

| Provider | Free tier | Get a key |
| --- | --- | --- |
| **Twelve Data** (recommended) | ~800 requests/day, 8/min · good daily history · handles crypto (`BTC/USD`) | <https://twelvedata.com/pricing> |
| **Alpha Vantage** | very common, but a low daily request cap | <https://www.alphavantage.co/support/#api-key> |

No key handy? Click **Explore with demo data** to try everything with a bundled,
clearly-labelled **synthetic** dataset (not real prices).

Fetched history is cached in your browser for 12 hours to stay well within the
free request limits.

## What it computes

- **Backtest** — growth of $10,000 with periodic rebalancing (annual / quarterly
  / monthly / never), overlaid against a benchmark (SPY, VTI, QQQ, AGG…).
- **Return** — total return, CAGR, best / worst calendar year, % positive months.
- **Risk** — annualized volatility, max drawdown (with an underwater chart),
  monthly VaR & CVaR at 95%.
- **Risk-adjusted** — Sharpe, Sortino, Calmar (risk-free rate is configurable).
- **Vs. benchmark** — beta, annualized alpha, correlation.
- **Diversification** — a monthly-return correlation heatmap across holdings.
- **Monte Carlo** — bootstraps the portfolio's own monthly-return history to
  project a range of outcomes over N years, with optional monthly contributions
  and a goal-probability readout.
- **Model portfolios** — one-click load of real, public "lazy" allocations
  (60/40, Bogleheads Three-Fund, All Weather, Permanent, Golden Butterfly, …).

## Running it

No build step. Serve the repo root and open the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/portfolio-labs/
```

(A service worker needs `http://localhost` or `https://` — it's inactive on
`file://`, but the app still works when opened directly.)

## Files

| File | Responsibility |
| --- | --- |
| `index.html` | Page structure: builder, controls, results |
| `css/styles.css` | Styling; dark + light themes, responsive |
| `js/data.js` | Ticker universe, real lazy-portfolio allocations, formatting, offline demo series |
| `js/providers.js` | Live-data adapters (Twelve Data, Alpha Vantage) — daily history + quotes |
| `js/stats.js` | The engine: backtest, metrics, correlations, VaR/CVaR, Monte Carlo |
| `js/charts.js` | Inline-SVG charts (growth, drawdown, donut, heatmap, fan, bars) |
| `js/app.js` | State, data fetching, rendering, interactions, persistence |
| `manifest.webmanifest`, `sw.js` | PWA install + offline app shell (folder-scoped) |

## A note on the numbers

Metrics are computed from the price history your provider returns. Free daily
series are typically **unadjusted** (they don't add back dividends), so total
returns for high-yield holdings are slightly understated versus a
dividend-adjusted source. Everything here is for research and education —
**not investment advice**, and past performance doesn't predict future results.
