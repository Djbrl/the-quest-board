FROM node:slim

RUN apt-get update && \
    apt-get install -y python3 python3-pip

RUN mkdir backend

WORKDIR backend

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]