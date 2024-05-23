FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV production

RUN npm ci --only=production --quiet
COPY --chown=node:node --from=builder /app/prisma /app/prisma
COPY --chown=node:node --from=builder /app/src /app/src

EXPOSE 8080

CMD ["npm","start", "node", "src/servers/app.js"]