#!/bin/bash

# Test runner script for the sonioic project

echo "🧪 Sonioic Test Runner"
echo "======================"

case "$1" in
  "db")
    echo "Running database tests only..."
    npm test -- --testPathPatterns="db"
    ;;
  "unit")
    echo "Running unit tests only..."
    npm test -- --testPathPatterns="(stoicPhrase|userSetting|sharedSettings)\.test\.ts"
    ;;
  "integration")
    echo "Running integration tests only..."
    npm test -- --testPathPatterns="integration\.test\.ts"
    ;;
  "watch")
    echo "Running tests in watch mode..."
    npm run test:watch
    ;;
  "coverage")
    echo "Running tests with coverage..."
    npm run test:coverage
    ;;
  "verbose")
    echo "Running tests with verbose output..."
    npm run test:verbose
    ;;
  *)
    echo "Usage: $0 {db|unit|integration|watch|coverage|verbose}"
    echo ""
    echo "Options:"
    echo "  db          - Run only database tests"
    echo "  unit        - Run only unit tests"
    echo "  integration - Run only integration tests"
    echo "  watch       - Run tests in watch mode"
    echo "  coverage    - Run tests with coverage report"
    echo "  verbose     - Run tests with verbose output"
    echo "  (no args)   - Run all tests"
    echo ""
    echo "Running all tests..."
    npm test
    ;;
esac
