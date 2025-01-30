# Changelog

## [Unreleased]

### Added
- New budget calculation utilities in `src/utils/budget/calculations.ts`
- New custom hook `useBudgetMetrics` for centralized budget calculations
- Improved code organization with dedicated budget utilities folder

### Changed
- Refactored budget calculations into reusable utility functions
- Simplified budget calculation logic with pure functions
- Improved type safety for budget calculations

### Technical Details
- Created pure calculation functions for better testability
- Implemented memoization for performance optimization
- Centralized budget calculation logic to reduce code duplication