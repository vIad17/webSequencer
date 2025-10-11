FROM node:22-alpine3.21

#RUN npm install -g yarn

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

CMD ["yarn", "start", "--host", "0.0.0.0", "--port", "5174"]
