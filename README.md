# health-aid API

[![Build Status](https://travis-ci.com/10XStartup/health-aid-api.svg?branch=main)](https://travis-ci.com/10XStartup/health-aid-api)
[![Coverage Status](https://coveralls.io/repos/github/10XStartup/health-aid-api/badge.svg?branch=main)](https://coveralls.io/github/10XStartup/health-aid-api?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/10XStartup/health-aid-api/badge.svg?targetFile=package.json)](https://snyk.io/test/github/10XStartup/health-aid-api?targetFile=package.json)
![GitHub issues](https://img.shields.io/github/issues/10XStartup/health-aid-api)

## API Documentation

[Checkout the API Documentation](https://documenter.getpostman.com/view/17791415/2s93JzLfvp)

---

## Requirements

1. Node 17 and above
2. YARN
3. Docker
4. MongoDB

## Project Installation

1. `cd` into whatever directory you want work from.
2. Run `https://github.com/10XStartup/health-aid-api.git` then `cd` into the repo.
3. After cloning the project, run `cp .env .env.example` on your terminal to create a new `.env` file from the `.env.example`.
4. Run `yarn install` to install all the dependencies.
5. Run `yarn dev` to start the project in development mode.
6. Run `yarn build` to build the project for production.
7. Run `yarn start` to start the project in production mode.

---

## Project Setup

1. Create a database on your machine.

```bash
Your database url in the `.env` file should as follows

DATABASE_URL="mongodb://johndoe:randompassword@localhost:27017/mydb?authSource=admin"

mydb : The name of the databse you created on your machine
johndoe : The username of the database
randompassword : The password of the database
```

---

**Note**
If you have discovered a bug or have a feature suggestion, feel free to create an issue on [Github](https://github.com/10XStartup/health-aid-api/issues).

## Making contributions

[Checkout the contributions guidelines](https://github.com/10XStartup/health-aid-api/blob/main/CONTRIBUTION.md)

Dont forget to star or fork this if you like it

### License

[![license](https://img.shields.io/badge/license-GPL-4dc71f.svg)](https://github.com/10XStartup/health-aid-api/blob/main/LICENCE)

This project is licensed under the terms of the [GPL license](/LICENSE).
