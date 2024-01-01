FROM node:18-alpine

RUN mkdir /frontend

WORKDIR /frontend

COPY package.json .

RUN npm install

COPY . .

# # Set environment variables
# ARG VUE_APP_BACKEND_IP
# # ARG VUE_APP_BACKEND_HOST_PORT
# ENV VUE_APP_BACKEND_IP=${VUE_APP_BACKEND_IP}
# # ENV VUE_APP_BACKEND_HOST_PORT=${VUE_APP_BACKEND_HOST_PORT}

EXPOSE 3000

CMD ["npm", "run", "dev"]
