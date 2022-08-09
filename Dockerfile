FROM node:16-alpine

WORKDIR /usr/src/app
COPY . .

ENV NODE_ENV=production

RUN yarn global add sequelize-cli nodemon
RUN yarn

EXPOSE 8081