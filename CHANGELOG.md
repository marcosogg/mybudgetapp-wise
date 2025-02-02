# Changelog

## [Unreleased]

### Added
- Implemented Wise CSV import functionality
- Added specific validation for Wise format CSV files
- Enhanced error handling with clear messages
- Improved code organization and documentation

### Changed
- Simplified CSV import to three essential columns (Date, Amount, Merchant)
- Updated CSV parsing configuration for better data handling
- Refactored transaction import logic for clarity
- Improved validation and error messaging

### Technical Details
- Added Papa Parse configuration for proper CSV handling
- Implemented strict validation for required fields
- Enhanced date formatting and validation
- Improved error handling for common import scenarios