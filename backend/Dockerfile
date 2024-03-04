FROM node:slim


# https://dev.to/cloudx/how-to-use-puppeteer-inside-a-docker-container-568c
RUN apt-get update && apt-get install openssl -y

WORKDIR /backend

COPY package.json .

COPY prisma/ .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
