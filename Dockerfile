FROM node:18

WORKDIR /usr/src/app

RUN npm install

COPY package*.json ./

COPY . .

ENV PORT=8080

EXPOSE 8080

CMD ["npm", "run", "start"]