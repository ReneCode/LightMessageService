FROM node:6.9

WORKDIR /app
COPY . .

RUN npm install
CMD npm start

