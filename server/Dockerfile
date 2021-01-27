FROM node:current

WORKDIR /usr/src/app

COPY package.json ./
RUN yarn
RUN npm install pm2 -g

COPY tsconfig.json ./
COPY .prod.env ./
COPY ./src ./src

RUN yarn build
EXPOSE 80
CMD ["pm2-runtime", "start", "dist/index.js"]