# cypress_os_bankingtest

## Description

This project is a simple e2e test suite for the Banking application in Outsystems. It uses Cypress to run the tests.

## Setting up the banking application in Outsystems

1. Open Service Studio and create a new application.
1. In the New application dialog, select 'From an app'.
1. Select 'Banking' from the list of apps and click 'Install'.
1. Note that the application name has to be 'Banking' for the tests to work.

## Installation

Instructions on how to install the project

```bash
npm install
```

## Setting up the environment variables

1. Rename `.env.example` to `.env`.
1. Open the `.env` file and set the `BASE_URL` variable to the URL of the Banking application you want to test.

## Usage

### Run tests in headless mode

```bash
npx cypress run --browser chrome
```

### License

This project is licensed under the ISC License