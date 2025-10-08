FROM node:22-alpine3.21 AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:22-alpine3.21 AS runtime

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY --from=builder /app/dist ./dist

CMD ["yarn", "start", "--host", "0.0.0.0", "--port", "5174"]