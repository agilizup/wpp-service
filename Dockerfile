FROM node:18-alpine

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN apk add chromium

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install --ignore-engines

COPY . .

RUN yarn tsc

CMD [ "node", "dist/server.js" ]

EXPOSE 3004:3004
