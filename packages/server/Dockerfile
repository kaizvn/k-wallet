FROM node:latest

ARG NODE_ENV=development

ENV NODE_ENV=${NODE_ENV}
ENV REDIS_URL="redis://rdb:6379"
ENV MONGO_URL="mongodb://mdb:27017/SmartCity"

WORKDIR /usr/app/server
COPY package.json .
RUN yarn
RUN ["yarn" ,"global", "add", "nodemon"]

COPY . .

CMD ["yarn", "start"]

EXPOSE 3003