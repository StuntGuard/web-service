FROM node:18

WORKDIR /user/src/app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]