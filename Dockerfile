FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install @prisma/client

COPY . .

ENV NODE_ENV production
ENV PORT=8080


EXPOSE 8080

CMD ["npm", "run", "start"]