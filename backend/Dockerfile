FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .


EXPOSE 3001

CMD ["npm", "run", "dev"]

CMD ["npm", "run", "dev:worker"]