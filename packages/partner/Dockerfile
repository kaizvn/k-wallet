FROM node:latest

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/app/client
COPY package.json .
RUN yarn

COPY . .

CMD ["yarn", "dev"]

EXPOSE 3004