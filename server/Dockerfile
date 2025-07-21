FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install --production
EXPOSE 8088
CMD ["node", "server.js"]