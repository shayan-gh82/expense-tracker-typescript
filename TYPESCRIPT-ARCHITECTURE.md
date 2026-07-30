# TypeScript Architecture

The project is not a reduced rewrite. It is the complete previous application migrated to TypeScript while preserving all business and UI capabilities.

## Domain layer

All major entities are declared in `src/types/index.ts`:

- `Transaction`
- `Category`
- `Wallet`
- `WalletTransfer`
- `Reminder`
- `User`
- `FinanceState`
- `AuthState`
- `UISettings`

Literal unions are used for transaction types, wallet types, reminder frequencies, providers, themes, languages, and reminder statuses.

## Typed business logic

`src/utils/calculations.ts` contains typed functions for:

- Income, expense, and balance totals
- Wallet balance calculations
- Transfer effects
- Expense grouping by category
- Income/expense trend data
- Reminder status and upcoming reminders
- Transaction search and filtering

## Typed data exchange

`src/utils/csv.ts` includes typed CSV rows, invalid-row reports, imported transaction models, validation, and duplicate detection.

## Typed application infrastructure

- `UIContext.tsx` exposes a typed context value.
- `store.ts` exports `RootState` and `AppDispatch`.
- `store/hooks.ts` provides typed Redux hooks.
- Shared UI components use React attribute types.
- All source components use `.tsx`; business modules use `.ts`.
