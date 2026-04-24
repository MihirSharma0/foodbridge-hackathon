FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY server/ ./server/

EXPOSE 8080
ENV PORT=8080

CMD ["node", "server/server.cjs"]
