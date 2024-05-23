FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV production

EXPOSE 8080

CMD ["npm","start"]