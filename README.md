# Express-rest-api-sample

NodeJS REST API sample with integration Express, Sequelize, Jest, Swagger

## Configure Environment Variables

Open .env.sample file and edit the values and then  
change file name .env.development or .env.production depending on your environment if you need to.

This project uses [dotenv](https://www.npmjs.com/package/dotenv) to read and use .env file

- Modular Routes
- Database integration using [Sequelize V6](https://sequelize.org/master/)
- JWT Token based Authentication
- Implementing File Uploads by [multer](https://www.npmjs.com/package/multer)
- [Supported REST API Doc](https://documenter.getpostman.com/view/4627621/Tz5jfft1) (Postman)

## Project Start

This project requires Node 14 or later.

```javascript
 1. yarn // install dependencies
 2. yarn dev // run server

```

### Migration Skeleton

Create migration file using sequelize cli

```javascript
  npx sequelize-cli migration:generate --name <name>
```

### Running migrations

```javascript
  yarn db:migrate
```

### Sync database

```javascript
  yarn db:sync
```

### Test
To run test, install jest
```javascript
  yarn test
```

## API Docs

[GET] http://localhost:3000/api/v1/docs , After run server in localhost.

<img width="1399" alt="image" src="https://user-images.githubusercontent.com/81504356/160084497-acdef6f2-0385-4046-912c-5123acce0aaf.png">
