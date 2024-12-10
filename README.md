<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Readme

```bash
This project using nestjs and typescript with prisma ORM. I used postgres for database and pack in docker both db and service
Get transaction api between 2 user can't be use due to prisma bug (That I can't resolve).
Authentication implementation is completed. We can get token from login but I have a issue about auth guard (in c# .Net we use require autorization above controller. That's it).

Api path
- Login
http://localhost:3001/auth/login
- Create user (This will create bank account as well)
http://localhost:3001/user
- Update bank account balance (You can deposit,withdraw money from you account)
http://localhost:3001/user/balance
- Lend money 
http://localhost:3001/lend/lendmoney
- debtSummary 
http://localhost:3001/lend/summary/{guid}
- transactionhistory (prisma query still bug)
http://localhost:3001/lend/transaction/{yourguid}/{otheruserguid}

```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

```bash
# build image
$ docker compose build
$ docker compose up
```

## Postman collection

```bash
https://drive.google.com/file/d/1JvypiRGmerqSY3jDOaICDel5vN_TXZgu/view?usp=sharing
```


