FROM node:10.16.0

WORKDIR /coffer-db-service

COPY . /coffer-db-service

RUN rm -rf ./node_modules

RUN npm install

CMD ["npm", "start"]



