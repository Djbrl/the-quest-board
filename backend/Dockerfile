FROM node:slim

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# https://dev.to/cloudx/how-to-use-puppeteer-inside-a-docker-container-568c
RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /backend

# necessary to avoid unsupported root with --no-sandbox error puppeteer
RUN adduser --disabled-password --gecos '' postgres
RUN chown -R postgres:postgres /backend

USER postgres

COPY package.json .

COPY prisma/ .

RUN npm install

COPY . .

USER root
RUN chown -R postgres:postgres /backend
USER postgres

EXPOSE 3000

CMD ["npm", "start"]
