# ---------- builder ----------
FROM node:26.8.2-alpine3.24 AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN npm install -g yarn
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# ---------- runtime ----------
FROM nginx:1.31.5-alpine3.24-perl
COPY --from=builder /app/dist /usr/share/nginx/html/webSequencer
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5174
