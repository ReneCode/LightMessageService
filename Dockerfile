FROM node:6.9

ENV MONGODB_CONNECT=mongodb://localhost:27017
ENV MONGODB_DATABASE=lightmessage

WORKDIR /app
COPY . .

RUN npm install
CMD npm start

