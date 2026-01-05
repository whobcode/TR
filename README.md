# Test Runner

**Category**: Build/Dev Tool

A comprehensive test suite for validating Python script API integrations with mocking, coverage, and AI-powered test generation.

## Features (Planned)
- API integration tests for all scripts
- Mock server for external APIs
- Coverage reporting
- AI-generated test cases
- Regression testing
- Performance benchmarking
- CI/CD integration

## APIs Tested
- Twitter API (tweepy integration)
- WAQI Air Quality API
- Firebase Realtime Database
- TinyURL API
- IP Geolocation APIs
- Highcharts Export API

## Installation

```bash
npm install
```

## Usage

```bash
npm test                  # Run all tests
npm run test:api          # API tests only
npm run test:coverage     # With coverage
npm run test:generate     # AI-generate new tests
npm run test:watch        # Watch mode
```

## Tech Stack
- Jest/Vitest
- MSW for API mocking
- Workers AI for test generation
- c8 for coverage

## Project Structure

```
TR/
├── src/                # Test utilities
├── tests/
│   ├── api/            # API integration tests
│   ├── unit/           # Unit tests
│   └── integration/    # Integration tests
├── mocks/              # API mocks
├── jest.config.js
└── package.json
```

## License

MIT
