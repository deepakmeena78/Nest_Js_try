# base image
FROM node:22 AS base

WORKDIR /ventursa

ARG PORT

RUN npm install pm2 --location=global

COPY package.json .
COPY package-lock.json .
COPY prisma/schema.prisma prisma/schema.prisma

ENV HUSKY=0

RUN npm install

COPY . .

EXPOSE ${PORT}

# development image
FROM base AS ventursa-dev

CMD ["npm", "run", "start:dev"]

# production image
FROM base AS ventursa

RUN npm run build

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
