# Build the Vue app
FROM node:16 as build-stage
WORKDIR /app
COPY package*.json ./

RUN npm install
COPY ./ .
RUN npm run build

# Put the built app in a serving container
FROM moreillon/api-proxy as production-stage
COPY --from=build-stage /app/dist /usr/src/app/dist

# Custom stuff
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
