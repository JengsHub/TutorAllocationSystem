FROM node:current

WORKDIR /usr/src/app

COPY package.json ./
RUN yarn
RUN npm install pm2 -g

COPY tsconfig.json ./
COPY ./src ./src
COPY .env ./

RUN yarn build
COPY ./dist .
EXPOSE 80
CMD ["pm2-runtime", "start", "index.js"]