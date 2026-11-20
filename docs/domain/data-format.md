---
type: domain
sources: [PostFinance sample exports 2025 (Account1, Account3), profiled 20.11.26]
status: draft
stale_after: 2026-12-31
---

# Data format: the sample CSV exports

One CSV per account and year (Account1 = private account "Privatkonto", Account3 = credit card "KK-Konto"), 15 columns, every amount positive. `src/engines/ingest` turns each row into one `Transaction` (`src/contracts/transaction.ts`).

## Columns

| Column | Meaning | Rule in ingest |
| --- | --- | --- |
| type | expense, income or transfer | Income from a shop (or on the card) is a refund |
| source_id, target_id | Who paid whom | The side that is our account sets the sign: money out is negative |
| source_label, target_label | Readable names | Shown as counterparty; ids are inconsistent |
| transaction_date, value_date | Booking and value date | Use transaction_date |
| amount, currency | Original amount | Kept in `original` when not CHF |
| exchange_rate, base_amount, base_currency | Converted amount | Use base_amount (CHF), rounded to Rappen |
| status | settled in all sample rows | Anything else is pending and stays out of totals |
| name | Free text, often with a date or "#2" | Kept as `rawName`; part of the id; never parsed |
| description | Empty in all sample rows | Ignored |

## Inconsistencies found in the samples

| Inconsistency | Example | What ingest does |
| --- | --- | --- |
| Card payments appear in both files | 12 "Kreditkarten-Zahlung" rows, Account1 → Account3 | Keeps the sender's copy, kind `transfer` |
| Refunds typed as income | 35 card income rows; only 5 names say "refund" | kind `refund`, netted against spending |
| Refunds do not match the charge | Charged 2 × 365.25, refunded 2 × 367.29 | Not matched yet (alerts TODO) |
| Foreign currency not converted | 13 EUR rows with exchange rate 1.0 | Flag `unconverted-currency` |
| Long decimals | 46.96976052505031 | Rounded; flag `rounded-amount` |
| One merchant, several ids | OrellFuessli vs Orell_Füssli; Amazon vs Amazon.com | Aliases in `content/merchants.json` |
| Typos in merchant names | Aebercrombie, Lufhansa, Thommy Hilfiger | Same alias list |
| Name format differs per file | "Bestellung OrellFuessli" vs "Orell Füssli 2025-02-08 #2" | Dates come from transaction_date only |
| Identical rows on one day | 4 × 1,766.50 CHF flights on 2025-09-18 | Kept; alerts flags them |
| Same date, amount, payer, different meaning | Monthly and 13th salary on 2025-12-23 | The id includes the name |
| Card payments do not reconcile | No billing cycle matches the payments | Never compute balances by summing rows |

Open questions for PostFinance: which exchange rate applies to EUR rows, and what is the card billing cycle.
