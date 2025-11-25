FROM node:22-alpine3.21

WORKDIR /app

COPY package.json ./
RUN yarn

COPY . .

CMD ["yarn", "start", "--host", "0.0.0.0", "--port", "5174"]
