FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install --production

COPY . .

EXPOSE 3000

ENV DATABASE_CONNECTION=mongodb://admin:adminpass@mongo-container:27017/ws-users?authSource=admin
ENV JWT_SECRET=supersecreto

RUN yarn build

CMD ["yarn", "start:prod"]
