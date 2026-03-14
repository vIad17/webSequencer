FROM node:22-alpine3.21 AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:22-alpine3.21

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY . .

CMD ["yarn", "start", "--host", "0.0.0.0", "--port", "5174"]
