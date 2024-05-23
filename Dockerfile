FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV production
ENV PORT=8080

RUN npx prisma generate
RUN rm -rf node_modules
RUN npm install --only=production

EXPOSE 8080

CMD ["npm", "run", "start"]