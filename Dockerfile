FROM node as dev
USER node
WORKDIR /usr/src/app
EXPOSE 3001
EXPOSE 9229
CMD [ "yarn", "dev" ]

FROM node as builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:slim as prod
ENV NODE_ENV prod
USER node
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 8080
CMD [ "node", "dist/index.js" ]