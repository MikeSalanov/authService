FROM node:20.13.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x ./entrypoint.sh

EXPOSE 4001

ENTRYPOINT ["./entrypoint.sh"]
