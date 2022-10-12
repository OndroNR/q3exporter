FROM node:18-alpine

RUN apk add --no-cache dumb-init

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci --production
COPY . .

EXPOSE 3000

CMD [ "dumb-init", "node", "index.js" ]