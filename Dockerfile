FROM node:20.15.0-alpine

WORKDIR /usr/src/app

# Installs latest Chromium (100) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Puppeteer v13.5.0 works with Chromium 100.
RUN npm install puppeteer@13.5.0

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /usr/src/app

COPY . .

RUN rm -rf /usr/src/app/dist /usr/src/app/tokens

RUN npm install --include=optional sharp
RUN npm run tsc

RUN mkdir -p /usr/src/app/tokens
RUN chown -R pptruser:pptruser /usr/src/app/tokens
# Run everything after as non-privileged user.
USER pptruser

CMD [ "node", "dist/server.js" ]

EXPOSE 3004
